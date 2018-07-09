pragma solidity 0.4.18;

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";
import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "../node_modules/@aragon/apps-token-manager/contracts/TokenManager.sol";

import "../apps/members/contracts/Members.sol";


contract KitBase is APMNamehash {
    ENS public ens;
    DAOFactory public fac;

    event DeployInstance(address dao);
    event InstalledApp(address appProxy, bytes32 appId);

    function KitBase(DAOFactory _fac, ENS _ens) public {
        ens = _ens;

        // If no factory is passed, get it from on-chain bare-kit
        if (address(_fac) == address(0)) {
            bytes32 bareKit = apmNamehash("bare-kit");
            fac = KitBase(latestVersionAppBase(bareKit)).fac();
        } else {
            fac = _fac;
        }
    }

    function latestVersionAppBase(bytes32 appId) public view returns (address base) {
        Repo repo = Repo(PublicResolver(ens.resolver(appId))
            .addr(appId));
        (, base, ) = repo.getLatest();

        return base;
    }
}


contract Kit is KitBase {
    MiniMeTokenFactory public tokenFactory;
    uint256 constant public PCT = 10 ** 16;
    address constant public ANY_ENTITY = address(-1);

    function Kit(ENS ens) public KitBase(DAOFactory(0), ens) {
        tokenFactory = new MiniMeTokenFactory();
    }   

    function newInstance() public {
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());
        acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

        address root = msg.sender;
        bytes32 votingAppId = apmNamehash("voting");
        bytes32 tokenManagerId = apmNamehash("token-manager");
        bytes32 membersId = apmNamehash("members");

        Members members = Members(dao.newAppInstance(membersId, latestVersionAppBase(membersId)));
        Voting voting = Voting(dao.newAppInstance(votingAppId, latestVersionAppBase(votingAppId)));		
        TokenManager tokenManager = TokenManager(
            dao.newAppInstance(tokenManagerId, latestVersionAppBase(tokenManagerId)));  
        MiniMeToken token = tokenFactory.createCloneToken(address(0), 0, "App token", 0, "APP", true);
        token.changeController(tokenManager);
    
        // Initialize apps
        tokenManager.initialize(token, true, 0, true);		
        voting.initialize(token, 50 * PCT, 20 * PCT, 1 days);   
        acl.createPermission(this, tokenManager, tokenManager.MINT_ROLE(), this);
        tokenManager.mint(root, 1); // Give one token to root

        acl.createPermission(ANY_ENTITY, voting, voting.CREATE_VOTES_ROLE(), root);

        acl.createPermission(root, members, members.MANAGE_MEMBERS_ROLE(), root);

        acl.grantPermission(voting, tokenManager, tokenManager.MINT_ROLE());

        // Clean up permissions
        acl.grantPermission(root, dao, dao.APP_MANAGER_ROLE());
        acl.revokePermission(this, dao, dao.APP_MANAGER_ROLE());
        acl.setPermissionManager(root, dao, dao.APP_MANAGER_ROLE());

        acl.grantPermission(root, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.setPermissionManager(root, acl, acl.CREATE_PERMISSIONS_ROLE());

        DeployInstance(dao);
    }

}
