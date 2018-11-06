pragma solidity 0.4.24;

import "@aragon/os/contracts/factory/DAOFactory.sol";
import "@aragon/os/contracts/apm/Repo.sol";
import "@aragon/os/contracts/lib/ens/ENS.sol";
import "@aragon/os/contracts/lib/ens/PublicResolver.sol";
import "@aragon/os/contracts/apm/APMNamehash.sol";

import "./interfaces/IRewardsKit.sol";


contract RewardsKitBase is APMNamehash, IRewardsKit {
    event DeployInstance(address dao);
    event InstalledApp(address dao, address appProxy, bytes32 appId);
    event CreateTokens(MiniMeToken rewardToken, MiniMeToken daoToken);

    ENS public ens;
    DAOFactory public fac;
    MiniMeTokenFactory public tokenFactory;

    constructor(DAOFactory _fac, ENS _ens, MiniMeTokenFactory _tokenFactory) public {
        ens = _ens;
        fac = _fac;
        tokenFactory = _tokenFactory != MiniMeTokenFactory(0) ?
            _tokenFactory : new MiniMeTokenFactory();
    }

    function createDAOTokens(
        string _rewardTokenName,
        uint8 _rewardTokenDecimals,
        string _rewardTokenSymbol,
        string _daoTokenName,
        uint8 _daoTokenDecimals,
        string _daoTokenSymbol
    ) external returns (MiniMeToken, MiniMeToken) {
        return _createDAOTokens(
            _rewardTokenName,
            _rewardTokenDecimals,
            _rewardTokenSymbol,
            _daoTokenName,
            _daoTokenDecimals,
            _daoTokenSymbol
        );
    }

    function latestVersionAppBase(bytes32 appId) public view returns (address base) {
        Repo repo = Repo(PublicResolver(ens.resolver(appId))
            .addr(appId));
        (, base, ) = repo.getLatest();

        return base;
    }

    function _createDAOTokens(
        string _rewardTokenName,
        uint8 _rewardTokenDecimals,
        string _rewardTokenSymbol,
        string _daoTokenName,
        uint8 _daoTokenDecimals,
        string _daoTokenSymbol
    ) internal returns (MiniMeToken, MiniMeToken) {
        MiniMeToken rewardToken = tokenFactory.createCloneToken(
            MiniMeToken(0),
            0,
            _rewardTokenName,
            _rewardTokenDecimals,
            _rewardTokenSymbol,
            true
        );
        MiniMeToken daoToken = tokenFactory.createCloneToken(
            MiniMeToken(0),
            0,
            _daoTokenName,
            _daoTokenDecimals,
            _daoTokenSymbol,
            true
        );

        emit CreateTokens(rewardToken, daoToken);
        return (rewardToken, daoToken);
    }

    function _installApp(Kernel _dao, bytes32 _appId) internal returns (AragonApp) {
        address baseAppAddress = latestVersionAppBase(_appId);
        require(baseAppAddress != address(0), "App should be deployed");
        AragonApp appProxy = AragonApp(_dao.newAppInstance(_appId, baseAppAddress));

        emit InstalledApp(_dao, appProxy, _appId);
        return appProxy;
    }

    function _createDAO() internal returns (Kernel) {
        Kernel dao = fac.newDAO(this);
        ACL acl = ACL(dao.acl());
        acl.createPermission(this, dao, dao.APP_MANAGER_ROLE(), this);
        return dao;
    }
}