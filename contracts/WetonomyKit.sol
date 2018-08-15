pragma solidity 0.4.18;

import "./KitBase.sol";
import "./WetonomyConstants.sol";

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-finance/contracts/Finance.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";

import "../apps/members/contracts/Members.sol";
import "../apps/timetracking/contracts/InflationTimeTracking.sol";
import "../apps/task-board/contracts/TaskBoard.sol";
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
        TaskBoard taskBoard = installTaskBoard(dao);  

        MiniMeToken debtToken = tokenManager.daoToken();

        Voting voting = installVotingApp(dao, debtToken);
        
        acl.createPermission(root, members, members.MANAGE_MEMBERS_ROLE(), root);
        acl.createPermission(root, tokenManager, tokenManager.MINT_ROLE(), root);
        acl.createPermission(ANY_ENTITY, voting, voting.CREATE_VOTES_ROLE(), root);
        acl.createPermission(root, timeTracking, timeTracking.MANAGE_TRACKING_ROLE(), root);        
        acl.createPermission(root, taskBoard, taskBoard.INCREMENT_ROLE(), root);

        // // Clean up permissions
        acl.grantPermission(root, dao, dao.APP_MANAGER_ROLE());
        acl.revokePermission(this, dao, dao.APP_MANAGER_ROLE());
        acl.setPermissionManager(root, dao, dao.APP_MANAGER_ROLE());

        acl.grantPermission(root, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.setPermissionManager(root, acl, acl.CREATE_PERMISSIONS_ROLE());

        DeployInstance(dao);
    }

    function installMembersApp(Kernel _dao) public returns (Members) {
        bytes32 membersId = apmNamehash("members");
        Members members = Members(_dao.newAppInstance(membersId, latestVersionAppBase(membersId)));        

        return members;
    }

    function installTokenManager(Kernel _dao, Members _members) public returns (ExchangeTokenManager) {
        bytes32 tokenManagerId = apmNamehash("token-rewards-manager");
        ExchangeTokenManager tokenManager = ExchangeTokenManager(
            _dao.newAppInstance(tokenManagerId, latestVersionAppBase(tokenManagerId))
        );

        MiniMeToken rewardToken = tokenFactory.createCloneToken(address(0), 0, "Reward token", 0, "RWD", false);
        MiniMeToken debtToken = tokenFactory.createCloneToken(address(0), 0, "Debt token", 0, "DBT", false);
        rewardToken.changeController(tokenManager);
        debtToken.changeController(tokenManager);

        // tokenManager.initialize(
        //     _members,
        //     rewardToken,
        //     debtToken,
        //     DEFAULT_REWARD_TO_DAO_COURSE,
        //     DEFAULT_INFLATION_MULTIPLIER
        // );

        return tokenManager;
    }

    function installTimeTracking(
        Kernel _dao, 
        ITokenManager _tokenManager, 
        IMembers _members) 
        public 
        returns (TimeTracking)
    {
        bytes32 timeTrackingId = apmNamehash("timetracking");
        
        InflationTimeTracking timeTracking = InflationTimeTracking(
            _dao.newAppInstance(timeTrackingId, latestVersionAppBase(timeTrackingId))
        );

        timeTracking.initialize(
            _tokenManager,
            _members,
            DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS,
            DEFAULT_MAX_HOURS_PER_PERIOD
        );

        return timeTracking;
    }
    
    function installTaskBoard(Kernel _dao) public returns (TaskBoard) {
        bytes32 taskBoardId = apmNamehash("taskboard");
        TaskBoard taskBoard = TaskBoard(   
            _dao.newAppInstance(taskBoardId, latestVersionAppBase(taskBoardId)));       

        return taskBoard;
    }

    function installVotingApp(Kernel _dao, MiniMeToken _token) public returns(Voting) {
        bytes32 votingAppId = apmNamehash("voting");

        Voting voting = Voting(_dao.newAppInstance(votingAppId, latestVersionAppBase(votingAppId)));
        voting.initialize(_token, 50 * PCT, 20 * PCT, 1 days);

        return voting;
    }

}
