pragma solidity 0.4.18;

import "./KitBase.sol";
import "./WetonomyConstants.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";

import "../apps/members/contracts/Members.sol";
import "../apps/timetracking/contracts/InflationTimeTracking.sol";
import "../apps/token-rewards-manager/contracts/ExchangeTokenManager.sol";


contract WetonomyKit is KitBase, WetonomyConstants {

    MiniMeTokenFactory public tokenFactory;    

    function WetonomyKit(ENS ens) public KitBase(DAOFactory(0), ens) {
        tokenFactory = new MiniMeTokenFactory();
    }

    function newInstance() public {
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());
        acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);

        address root = msg.sender;

        Members members = installMembersApp(dao);        
        ExchangeTokenManager tokenManager = installTokenManager(dao, members);
        TimeTracking timeTracking = installTimeTracking(dao, tokenManager, members);

        MiniMeToken debtToken = tokenManager.daoToken();

        Voting voting = installVotingApp(dao, debtToken);
        
        acl.createPermission(root, members, members.MANAGE_MEMBERS_ROLE(), root);
        acl.createPermission(timeTracking, tokenManager, tokenManager.MINT_ROLE(), root);
        acl.createPermission(ANY_ENTITY, voting, voting.CREATE_VOTES_ROLE(), root);
        acl.createPermission(root, timeTracking, timeTracking.MANAGE_TRACKING_ROLE(), root);

        // Clean up permissions
        acl.grantPermission(root, dao, dao.APP_MANAGER_ROLE());
        acl.revokePermission(this, dao, dao.APP_MANAGER_ROLE());
        acl.setPermissionManager(root, dao, dao.APP_MANAGER_ROLE());

        acl.grantPermission(root, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.setPermissionManager(root, acl, acl.CREATE_PERMISSIONS_ROLE());

        DeployInstance(dao);
    }

    function installMembersApp(Kernel _dao) public returns (Members) {        
        Members members = Members(_dao.newAppInstance(membersId, latestVersionAppBase(membersId)));
        return members;
    }

    function installTokenManager(Kernel _dao, IMembers _members) public returns (ExchangeTokenManager) {
        ExchangeTokenManager tokenManager = ExchangeTokenManager(
            _dao.newAppInstance(tokenManagerId, latestVersionAppBase(tokenManagerId))
        );

        MiniMeToken rewardToken = tokenFactory.createCloneToken(address(0), 0, "Reward token", 18, "RWD", false);
        MiniMeToken debtToken = tokenFactory.createCloneToken(address(0), 0, "Debt token", 18, "DBT", false);
        rewardToken.changeController(tokenManager);
        debtToken.changeController(tokenManager);

        tokenManager.initialize(
            _members,
            rewardToken,
            debtToken,
            DEFAULT_REWARD_TO_DAO_COURSE,
            DEFAULT_INFLATION_MULTIPLIER
        );

        return tokenManager;
    }

    function installTimeTracking(
        Kernel _dao, 
        ITokenManager _tokenManager, 
        IMembers _members) 
        public 
        returns (TimeTracking)
    {       
        InflationTimeTracking timeTracking = InflationTimeTracking(
            _dao.newAppInstance(timetrackingId,
            latestVersionAppBase(timetrackingId))
        );

        timeTracking.initialize(
            _tokenManager,
            _members,
            DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS,
            DEFAULT_MAX_HOURS_PER_PERIOD
        );

        return timeTracking;
    }

    function installVotingApp(Kernel _dao, MiniMeToken _token) public returns(Voting) {
        Voting voting = Voting(_dao.newAppInstance(votingId, latestVersionAppBase(votingId)));
        voting.initialize(_token, 50 * PCT, 20 * PCT, 1 days);

        return voting;
    }

}
