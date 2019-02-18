pragma solidity 0.4.24;

import "./WetonomyKit.sol";


contract WetonomyKitAnyEntity is WetonomyKit {
    constructor(DAOFactory _fac, ENS _ens, MiniMeTokenFactory _tokenFactory)
        public WetonomyKit(_fac, _ens, _tokenFactory) {}
    
    function _configurePermissions(
        Kernel _dao,
        address _root,
        Members _members,
        TokenRewardsManager _tokenManager,
        Voting _voting,
        TimeTracking _timeTracking,
        TaskBoard _taskBoard,
        Parameters _parameters
    ) internal
    {
        ACL acl = ACL(_dao.acl());

        // Members
        acl.createPermission(ANY_ENTITY, _members, _members.MANAGE_MEMBERS_ROLE(), this);
        acl.grantPermission(ANY_ENTITY, _members, _members.MANAGE_MEMBERS_ROLE());

        // TimeTracking
        acl.createPermission(ANY_ENTITY, _timeTracking, _timeTracking.MANAGE_TRACKING_ROLE(), this);
        acl.grantPermission(ANY_ENTITY, _timeTracking, _timeTracking.MANAGE_TRACKING_ROLE());
        
        // // TaskBoard
        acl.createPermission(ANY_ENTITY, _taskBoard, _taskBoard.TASKBOARD_MANAGER_ROLE(), _root);

        // // // Voting
        acl.createPermission(ANY_ENTITY, _voting, _voting.CREATE_VOTES_ROLE(), _root);
        
        // // // TokenManager
        acl.createPermission(ANY_ENTITY, _tokenManager, _tokenManager.MINT_ROLE(), _root);
        acl.createPermission(ANY_ENTITY, _tokenManager, _tokenManager.TRANSFER_ROLE(), _root);
        acl.createPermission(ANY_ENTITY, _tokenManager, _tokenManager.REWARD_ROLE(), _root);
        acl.createPermission(ANY_ENTITY, _tokenManager, _tokenManager.MANAGE_TOKEN_MANAGER_ROLE(), _root);

        // Parameters
        acl.createPermission(ANY_ENTITY, _parameters, _parameters.CHANGE_PARAMETERS_ROLE(), _root);

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