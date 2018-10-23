pragma solidity 0.4.18;

import "../../token-rewards-manager/contracts/interfaces/IRewardTokenManager.sol";
import "../../members/contracts/interfaces/IMembers.sol";
import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
/// @title TaskBoard
/// @dev Used to pay out individuals or groups for task fulfillment through
/// stepwise work submission, acceptance, and payment
/// @author Mark Beylin <mark.beylin@consensys.net>, Gonçalo Sá <goncalo.sa@consensys.net>


contract TaskBoard is AragonApp {
    using SafeMath for uint256;
    bytes32 constant public INCREMENT_ROLE = keccak256("INCREMENT_ROLE");
    // bytes32 constant public DECREMENT_ROLE = keccak256("DECREMENT_ROLE");
    /*
    * Events
    */
    event TaskIssued(uint taskId);
    event TaskStageChange(uint taskId, TaskStages stage);
    event TaskAssigned(uint taskId, address indexed fulfiller);
    event Rewarded(uint _taskId, address assignee);
    event TaskKilled(uint taskId, address indexed issuer);
    event ContributionAdded(uint taskId, address indexed contributor, uint256 value);
    event TaskChanged(uint taskId);
    event IssuerTransferred(uint _taskId, address indexed _newIssuer);
    event PayoutIncreased(uint _taskId, uint _newFulfillmentAmount);


    /*
    * Storage
    */

    address public owner;

    Task[] public tasks;
    mapping (uint => Multihash) private data;
    IRewardTokenManager public tokenManager;
    IMembers public members;

    TaskStages[] public stages;
    /*
     * Enums
     */

    enum TaskStages {
        Unassigned,
        Assigned,
        InProgress,
        Review,
        Done,
        Archive
    }
    /*
    * Structs
    */

    struct Task {
        address issuer;
        address assignee;
        address arbiter;
        TaskStages taskStage;
        uint balance;
    }

    struct Fulfillment {
        bool accepted;
        address fulfiller;
        string data;
    }

    struct Multihash {
        bytes32 digest;
        uint8 hashFunction;
        uint8 size;
    }

    /*
     * Modifiers
     */
    modifier validateNotTooManyTasks() {
        require((tasks.length + 1) > tasks.length);
        _;
    }

    modifier validateTaskArrayIndex(uint _taskId) {
        require(_taskId < tasks.length);
        _;
    }

    modifier onlyIssuer(uint _taskId) {
        require(msg.sender == tasks[_taskId].issuer);
        _;
    }

    modifier onlyAssignee(uint _taskId) {
        require(msg.sender == tasks[_taskId].assignee);
        _;
    }

    modifier amountIsNotZero(uint _amount) {
        require(_amount != 0);
        _;
    }

    modifier isAtStage(uint _taskId, TaskStages _desiredStage) {
        if (_desiredStage == TaskStages.Assigned) {
            require(tasks[_taskId].taskStage == _desiredStage || tasks[_taskId].taskStage == TaskStages.InProgress);
        } else {
            require(tasks[_taskId].taskStage == _desiredStage);
        }
        _;
    }

    modifier isBeforeStage(uint _taskId) {
        require(tasks[_taskId].taskStage < TaskStages.Done);
        _;
    }
    /* solhint-disable */
    function sync(address[] iaa, uint[] ia, uint8[] hss, bytes32[] digest) external {
        uint i = 1;
        uint p = 0;
        uint k = ia[0];
        uint totalAmount = 0;
        for (; i <= k; i++) {
            _createTask(iaa[0], iaa[(i-1)*2+2], iaa[(i-1)*2+1], ia[i]);
            data[tasks.length - 1] = Multihash(digest[p], hss[(i-1)*2], hss[(i-1)*2+1]);
            p++;
            totalAmount = totalAmount.add(ia[i]);
        }
        i++;
        _transferTokensToContract(totalAmount);
        k = i+ia[i-1];
        for (; i < k; i += 1) {
            _changeTaskData(ia[i], digest[p], hss[(i-2)*2], hss[(i-2)*2+1]);
            p++;
        }
        p = (i-2)*2;
        i++;
        k = i+ia[i-1];
        totalAmount = 0;
        for (; i < k; i++) {
            uint oldBalance = tasks[ia[i]].balance;
            _killTask(ia[i]);
            if (oldBalance > 0) {
                totalAmount = totalAmount.add(oldBalance);
            }
        }
        if (totalAmount > 0) {
            tokenManager.transfer(this, iaa[0], totalAmount);
        }
        i++;
        k = i+2*ia[i-1];
        totalAmount = 0;
        for (; i < k; i += 2) {
            _contribute(ia[i], ia[i+1]);
            totalAmount = totalAmount.add(ia[i+1]);
        }
        _transferTokensToContract(totalAmount);
        i++;
        k = i+ia[i-1];
        for (; i < k; i++) {
            if (tasks[ia[i]].taskStage == TaskStages.Unassigned) {
                assignTask(ia[i], iaa[0]);
            } else if (stages[hss[p]] == TaskStages.Done) {
                if (tasks[ia[i]].balance > 0) {
                    require(tokenManager.reward(this, tasks[ia[i]].assignee, tasks[ia[i]].balance));
                    tasks[ia[i]].balance = 0;
                }
                _giveReward(ia[i]);
            }  else {
                // transitionToState will remove assignee if moveing from Assigned to Unassigned
                transitionToState(ia[i], stages[hss[p]]);
                TaskStageChange(ia[i], stages[hss[p]]);
            }
            p++;
        }
    }
    /* solhint-enable */

    /// @dev issueTask(): instantiates a new draft Task
    /// @param _issuer the address of the intended issuer of the Task
    /// @param _amount the reward of the Task
    /// @param _arbiter the address of the arbiter who can mediate claims
    function issueTask(
        address _issuer,
        bytes32 _digest, uint8 _hashFunction, uint8 _size,
        uint256 _amount,
        address _arbiter
    ) external validateNotTooManyTasks returns (uint) {
        _createTask(_issuer, address(0), _arbiter, _amount);
        data[tasks.length - 1] = Multihash(_digest, _hashFunction, _size);
        _transferTokensToContract(_amount);
        return (tasks.length - 1);
    }

    function issueMultipleTasks(
        address _issuer,
        bytes32[] _digest, uint8[] _hashFunction, uint8[] _size,
        uint256[] _amount,
        address[] _arbiter
    ) external returns (uint) {
        uint arrayLength = _amount.length;
        uint totalAmount = 0;
        for (uint i = 0; i < arrayLength; i++) {
            _createTask(_issuer, address(0), _arbiter[i], _amount[i]);
            data[tasks.length - 1] = Multihash(_digest[i], _hashFunction[i], _size[i]);
            totalAmount = totalAmount.add(_amount[i]);
        }
        _transferTokensToContract(totalAmount);
        return (tasks.length - 1);
    }

    /// @dev issueAndActivateTask(): instantiates a new draft Task
    /// @param _issuer the address of the intended issuer of the Task
    /// @param _digest the requirements of the Task
    /// @param _arbiter the address of the arbiter who can mediate claims
    /// @param _amount the total number of tokens being deposited upon activation
    function issueAndActivateTask(
        address _issuer,
        bytes32 _digest, uint8 _hashFunction, uint8 _size,
        uint256 _amount,
        address _arbiter,
        address _assignee
    ) external validateNotTooManyTasks returns (uint)
    {
        tasks.push(Task(_issuer, _assignee, _arbiter, TaskStages.Unassigned, _amount));
        Multihash memory entry = Multihash(_digest, _hashFunction, _size);
        data[tasks.length - 1] = entry;
        _transferTokensToContract(_amount);
        TaskIssued(tasks.length - 1);
        return (tasks.length - 1);
    }

    function singleContribute(uint _taskId, uint _amount) external {
        _contribute(_taskId, _amount);
        _transferTokensToContract(_amount);
    }

    function multipleContribute(uint[] _taskId, uint[] _amount) external {
        uint arrayLength = _taskId.length;
        uint totalAmount = 0;
        for (uint i = 0; i < arrayLength; i++) {
            _contribute(_taskId[i], _amount[i]);
            totalAmount = totalAmount.add(_amount[i]);
        }
        _transferTokensToContract(totalAmount);
    }

    function moveTaskForReview(uint _taskId) external isAtStage(_taskId, TaskStages.Assigned) {
        transitionToState(_taskId, TaskStages.Review);
    }

    modifier notIssuerOrArbiter(uint _taskId) {
        require(msg.sender != tasks[_taskId].issuer && msg.sender != tasks[_taskId].arbiter);
        _;
    }

    function changeSingleState(uint _taskId, TaskStages _newStage) external notDone(_taskId) {
        transitionToState(_taskId, _newStage);
    }

    function changeMultipleState(uint[] _taskId, TaskStages[] _newStage) external {
        uint arrayLength = _taskId.length;
        for (uint i = 0; i < arrayLength; i++) {
            transitionToState(_taskId[i], _newStage[i]);
        }
    }

    function killSingleTask(uint _taskId) external
    {
        uint oldBalance = tasks[_taskId].balance;
        _killTask(_taskId);
        if (oldBalance > 0) {
            tokenManager.transfer(this, tasks[_taskId].issuer, oldBalance);
        }
        TaskKilled(_taskId, msg.sender);
    }

    function killMultipleTask(uint[] _taskId) external
    {
        uint arrayLength = _taskId.length;
        uint totalAmount = 0;
        for (uint i = 0; i < arrayLength; i++) {
            uint oldBalance = tasks[_taskId[i]].balance;
            _killTask(_taskId[i]);
            if (oldBalance > 0) {
                totalAmount = totalAmount.add(oldBalance);
            }
        }
        tokenManager.transfer(this, tasks[_taskId[0]].issuer, totalAmount);
    }

    function changeSingleTaskData(uint _taskId, bytes32 _digest, uint8 _hashFunction, uint8 _size) external
    {
        _changeTaskData(_taskId, _digest, _hashFunction, _size);
    }

    function changeMultipleTaskData(uint[] _taskId, bytes32[] _digest, uint8[] _hashFunction, uint8[] _size) external
    {
        uint arrayLength = _taskId.length;
        for (uint i = 0; i < arrayLength; i++) {
            _changeTaskData(_taskId[i], _digest[i], _hashFunction[i], _size[i]);
        }
    }

    function assignMultipleTasks(uint[] _taskId, address[] _assignee) external
    {
        uint arrayLength = _taskId.length;
        for (uint i = 0; i < arrayLength; i++) {
            assignTask(_taskId[i], _assignee[i]);
        }
    }

    /// @dev giveSingleReward(): accept a given fulfillment
    /// @param _taskId the index of the Task
    function giveSingleReward(uint _taskId)
        external
    {
        if (tasks[_taskId].balance > 0) {
            require(tokenManager.reward(this, tasks[_taskId].assignee, tasks[_taskId].balance));
            tasks[_taskId].balance = 0;
        }
        _giveReward(_taskId);
    }

    function giveMultipleReward(uint[] _taskId) external
    {
        uint arrayLength = _taskId.length;
        for (uint i = 0; i < arrayLength; i++) {
            if (tasks[_taskId[i]].balance > 0) {
                require(tokenManager.reward(this, tasks[_taskId[i]].assignee, tasks[_taskId[i]].balance));
                tasks[_taskId[i]].balance = 0;
            }
            _giveReward(_taskId[i]);
        }
    }

    /// @dev getTask(): Returns the details of the Task
    /// @param _taskId the index of the Task
    /// @return Returns a tuple for the Task
    function getTask(uint _taskId)
        external
        view
        validateTaskArrayIndex(_taskId)
        returns (address issuer, uint balance, uint taskStage, bytes32 digest,
        uint hashFunction, uint size, address assignee)
    {
        issuer = tasks[_taskId].issuer;
        balance = tasks[_taskId].balance;
        taskStage = uint(tasks[_taskId].taskStage);
        digest = data[_taskId].digest;
        hashFunction = data[_taskId].hashFunction;
        size = data[_taskId].size;
        assignee = tasks[_taskId].assignee;
    }

    /// @dev getTasksCount() returns the number of tasks in the registry
    /// @return Returns the number of tasks
    function getTasksCount() external view returns (uint) {
        return tasks.length;
    }

    function getAccount(address from) external view returns (uint, uint) {
        return tokenManager.getUserBalance(from);
    }

    /*
   * Public functions
   */
    /// @dev TaskBoard(): instantiates
    /// @param _owner the issuer of the TaskBoard contract, who has the
    /// ability to remove tasks
    function initialize(address _owner, IMembers _members, IRewardTokenManager _tokenManager) public onlyInit {
        owner = _owner;
        members = _members;
        tokenManager = _tokenManager;
        stages = [TaskStages.Unassigned, TaskStages.Assigned, TaskStages.InProgress,
        TaskStages.Review, TaskStages.Done, TaskStages.Archive];

        initialized();
    }

    modifier onlyIssuerOrArbiter(uint _taskId) {
        require(msg.sender == tasks[_taskId].issuer ||
            (msg.sender == tasks[_taskId].arbiter && tasks[_taskId].arbiter != address(0)));
        _;
    }

    modifier enoughFundsToPay(uint _taskId) {
        require(tasks[_taskId].balance >= 0);
        _;
    }

    modifier notDone (uint _taskId) {
        require(tasks[_taskId].taskStage != TaskStages.Done);
        _;
    }

    /// @dev changeTaskArbiter(): allows the issuer to change a Task's arbiter
    /// @param _taskId the index of the Task
    /// @param _newArbiter the new address of the arbiter
    function changeTaskArbiter(uint _taskId, address _newArbiter)
        public
        validateTaskArrayIndex(_taskId)
        onlyIssuer(_taskId)
        isAtStage(_taskId, TaskStages.Unassigned)
    {
        tasks[_taskId].arbiter = _newArbiter;
        TaskChanged(_taskId);
    }

    /// @dev getFulfillment(): Returns the fulfillment at a given index
    /// @param _taskId the index of the Task
    /// @return Returns a tuple for the fulfillment
    function getReward(uint _taskId)
        public
        view
        validateTaskArrayIndex(_taskId)
        returns (uint)
    {
        return (tasks[_taskId].balance);
    }

    function setTokenManager(IRewardTokenManager _tokenManager) public {
        require(msg.sender == owner);
        tokenManager = _tokenManager;
    }

    /// @dev assignTask(): submit a assignee for the given Task
    /// @param _taskId the index of the Task
    function assignTask(uint _taskId, address _assignee)
        public
        validateTaskArrayIndex(_taskId)
        isAtStage(_taskId, TaskStages.Unassigned)
        //notIssuerOrArbiter(_taskId)
    {
        tasks[_taskId].assignee = _assignee;
        transitionToState(_taskId, TaskStages.Assigned);
        TaskAssigned(_taskId, _assignee);
    }

    /*
    * Internal functions
    */
    /// @dev transitionToState(): transitions the contract to the
    /// state passed in the parameter `_newStage` given the
    /// conditions stated in the body of the function
    /// @param _taskId the index of the Task
    /// @param _newStage the new stage to transition to
    function transitionToState(uint _taskId, TaskStages _newStage) internal notDone(_taskId) {
        if (_newStage == TaskStages.Assigned) {
            require(tasks[_taskId].assignee != address(0));
        }
        if (_newStage == TaskStages.Done) {
            require(tasks[_taskId].balance == 0);
        }
        if (_newStage == TaskStages.Unassigned) {
            tasks[_taskId].assignee = address(0);
        }
        tasks[_taskId].taskStage = _newStage;
        TaskStageChange(_taskId, _newStage);
    }

    function _createTask(
        address _issuer,
        address _assignee,
        address _arbiter,
        uint256 _amount
    ) internal validateNotTooManyTasks returns (uint) {
        tasks.push(Task(_issuer, _assignee, _arbiter, TaskStages.Unassigned, _amount));
        TaskIssued(tasks.length - 1);
    }

    /// @dev contribute(): a function allowing anyone to contribute tokens to a
    /// Task. Shouldn't keep them by accident (hence 'value').
    /// @param _taskId the index of the Task
    /// @param _amount the amount being contributed in ether to prevent accidental deposits
    /// @notice Please note you funds will be at the mercy of the issuer
    ///  and can be drained at any moment. Be careful!
    function _contribute(uint _taskId, uint _amount) internal
        validateTaskArrayIndex(_taskId)
        notDone(_taskId)
        amountIsNotZero(_amount)
    {
        tasks[_taskId].balance = tasks[_taskId].balance.add(_amount);
        ContributionAdded(_taskId, msg.sender, _amount);
    }

    /// @dev killTask(): drains the contract of it's remaining
    /// funds, and moves the Task into stage 3 (Done) since it was
    /// either killed in draft stage, or never accepted any fulfillments
    /// @param _taskId the index of the Task
    function _killTask(uint _taskId)
        internal
        validateTaskArrayIndex(_taskId)
        onlyIssuer(_taskId)
    {
        transitionToState(_taskId, TaskStages.Archive);
        tasks[_taskId].balance = 0;
        TaskKilled(_taskId, msg.sender);
    }

    function _giveReward(uint _taskId) internal
        validateTaskArrayIndex(_taskId)
        onlyIssuerOrArbiter(_taskId)
        isAtStage(_taskId, TaskStages.Review)
        enoughFundsToPay(_taskId)
    {
        transitionToState(_taskId, TaskStages.Done);
        Rewarded(_taskId, tasks[_taskId].assignee);
    }

    /// @dev changeData(): allows the issuer to change a Task's data
    /// @param _taskId the index of the Task
    /// @param _digest the new requirements of the Task
    function _changeTaskData(uint _taskId, bytes32 _digest, uint8 _hashFunction, uint8 _size) internal
        validateTaskArrayIndex(_taskId)
        onlyIssuer(_taskId)
        isBeforeStage(_taskId)
    {
        data[_taskId] = Multihash(_digest, _hashFunction, _size);
        TaskChanged(_taskId);
    }

    function _transferTokensToContract(uint _amount) private {
        //uint oldBalance = tasks[_TaskId].balance;
        if (_amount != 0) {
            require(tokenManager.transfer(msg.sender, this, _amount));
        }
        //require((tokenManager.balanceOf(this) - oldBalance) == _amount);
    }
}