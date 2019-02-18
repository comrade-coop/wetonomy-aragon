pragma solidity 0.4.24;

import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";

import "./RewardsKitBase.sol";
import "./WetonomyConstants.sol";
import "../apps/members/contracts/Members.sol";
import "../apps/timetracking/contracts/InflationTimeTracking.sol";
import "../apps/task-board/contracts/TaskBoard.sol";
import "../apps/token-rewards-manager/contracts/TokenRewardsManager.sol";
import "../apps/parameters/contracts/Parameters.sol";


contract WetonomyKit is RewardsKitBase, WetonomyConstants {

    constructor(DAOFactory _fac, ENS _ens, MiniMeTokenFactory _tokenFactory)
        public RewardsKitBase(_fac, _ens, _tokenFactory) {}

    function newInstance(MiniMeToken _rewardToken, MiniMeToken _daoToken) external returns(Kernel) {
        Kernel dao = _createDAO();

        Members members = installMembersApp(dao);
        TokenRewardsManager tokenManager = installTokenManagerApp(
            dao,
            members,
            _rewardToken,
            _daoToken
        );
        Voting voting = installVotingApp(dao, tokenManager.daoToken());

        TimeTracking timeTracking = installTimeTrackingApp(
            dao,
            tokenManager,
            members
        );
        TaskBoard taskBoard = installTaskBoardApp(
            dao,
            members,
            tokenManager
        );
        Parameters parameters = installParametersApp(
            dao,
            voting,
            members,
            timeTracking,
            tokenManager
        );

        _configurePermissions(
            dao,
            msg.sender,
            members
            ,
            tokenManager,
            voting,
            timeTracking,
            taskBoard,
            parameters
        );

        emit DeployInstance(dao);

        return dao;
    }

    function installMembersApp(Kernel _dao) public returns (Members) {
        Members members = Members(_installApp(_dao, membersId));
        members.initialize(members.DEFAULT_INITIAL_REPUTATION());
        return members;
    }

    function installTokenManagerApp(
        Kernel _dao,
        IMembers _members,
        MiniMeToken _rewardToken,
        MiniMeToken _daoToken)
        public
        returns (TokenRewardsManager) 
    {
        require(_rewardToken != MiniMeToken(0), "The reward token contract should be valid");
        require(_daoToken != MiniMeToken(0), "The DAO token contract should be valid");

        TokenRewardsManager tokenManager = TokenRewardsManager(_installApp(_dao, tokenManagerId));
        
        _rewardToken.changeController(tokenManager);
        _daoToken.changeController(tokenManager);

        tokenManager.initialize(
            _members,
            _rewardToken,
            _daoToken,
            DEFAULT_REWARD_TO_DAO_COURSE,
            DEFAULT_INFLATION_MULTIPLIER
        );

        return tokenManager;
    }

    function installTimeTrackingApp(
        Kernel _dao, 
        IRewardTokenManager _tokenManager, 
        IMembers _members) 
        public
        returns (TimeTracking)
    {
        InflationTimeTracking timeTracking = InflationTimeTracking(_installApp(_dao, timeTrackingId));
        timeTracking.initialize(
            _tokenManager,
            _members,
            DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS,
            DEFAULT_MAX_HOURS_PER_PERIOD
        );

        return timeTracking;
    }
    
    function installTaskBoardApp(
        Kernel _dao, 
        IMembers _members,
        IRewardTokenManager _tokenManager)
        public
        returns (TaskBoard)
    {
        TaskBoard taskBoard = TaskBoard(_installApp(_dao, taskBoardId));
        taskBoard.initialize(
            _members,
            _tokenManager
        );
        return taskBoard;
    }
    function installParametersApp(Kernel _dao, Voting _voting, Members _members, TimeTracking _timeTracking, 
            TokenRewardsManager _tokenManager) public returns (Parameters) 
    {
        Parameters parameters = Parameters(_installApp(_dao, parametersId));

        parameters.initialize(_voting, _members, _timeTracking, _tokenManager);

        return parameters;
    }

    function installVotingApp(Kernel _dao, MiniMeToken _token) public returns(Voting) {
        Voting voting = Voting(_installApp(_dao, votingId));
        voting.initialize(_token, uint64(50 * PCT), uint64(20 * PCT), 1 days);
        return voting;
    }

    function _configurePermissions(
        Kernel _dao,
        address _root,
        Members _members
        ,
        TokenRewardsManager _tokenManager,
        Voting _voting,
        TimeTracking _timeTracking,
        TaskBoard _taskBoard,
        Parameters _parameters
    ) internal
    {
        ACL acl = ACL(_dao.acl());

        // Members
        acl.createPermission(_root, _members, _members.MANAGE_MEMBERS_ROLE(), this);
        acl.grantPermission(_voting, _members, _members.MANAGE_MEMBERS_ROLE());

        // TimeTracking
        acl.createPermission(_root, _timeTracking, _timeTracking.MANAGE_TRACKING_ROLE(), this);
        acl.grantPermission(_voting, _timeTracking, _timeTracking.MANAGE_TRACKING_ROLE());
        
        // TaskBoard
        acl.createPermission(_voting, _taskBoard, _taskBoard.TASKBOARD_MANAGER_ROLE(), _root);

        // Voting
        acl.createPermission(ANY_ENTITY, _voting, _voting.CREATE_VOTES_ROLE(), _root);
        
        // TokenManager
        acl.createPermission(_timeTracking, _tokenManager, _tokenManager.MINT_ROLE(), _root);
        acl.createPermission(_taskBoard, _tokenManager, _tokenManager.TRANSFER_ROLE(), _root);
        acl.createPermission(_taskBoard, _tokenManager, _tokenManager.REWARD_ROLE(), _root);
        acl.createPermission(_voting, _tokenManager, _tokenManager.MANAGE_TOKEN_MANAGER_ROLE(), _root);

        // Parameters
        acl.createPermission(_root, _parameters, _parameters.CHANGE_PARAMETERS_ROLE(), _root);

        // Clean up permissions
        acl.grantPermission(_root, _dao, _dao.APP_MANAGER_ROLE());
        acl.revokePermission(this, _dao, _dao.APP_MANAGER_ROLE());
        acl.setPermissionManager(_root, _dao, _dao.APP_MANAGER_ROLE());

        acl.grantPermission(_root, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.revokePermission(this, acl, acl.CREATE_PERMISSIONS_ROLE());
        acl.setPermissionManager(_root, acl, acl.CREATE_PERMISSIONS_ROLE());

        acl.setPermissionManager(_root, _members, _members.MANAGE_MEMBERS_ROLE());
        acl.setPermissionManager(_root, _timeTracking, _timeTracking.MANAGE_TRACKING_ROLE());
    }
}
