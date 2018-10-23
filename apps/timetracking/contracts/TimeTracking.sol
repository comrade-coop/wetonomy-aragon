pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/IUnitsOfWork.sol";
import "../../members/contracts/interfaces/IMembers.sol";


contract TimeTracking is IUnitsOfWork, AragonApp {
    using SafeMath for uint256;

    event HoursTracked(address indexed ownerAddress, uint trackedHours);
    event PeriodCreated(address indexed ownerAddress, uint periodsCount, uint endTimestamp);

    struct Period {
        uint endTimestamp;
        uint trackedHours;
    }

    bytes32 constant public MANAGE_TRACKING_ROLE = keccak256("MANAGE_TRACKING_ROLE");

    IMembers public members;

    uint public periodLength;
    uint public maxHoursPerPeriod;
    mapping (address => Period[]) public addressToPeriods;
    mapping(address => uint) public addressToTrackedHours;

    modifier onlyMember() {
        if (members != address(0)) {
            var (accountAddress,) = members.getMemberByAddress(msg.sender);
            require(accountAddress != address(0));
        }
        _;
    }

    /**
    * @notice Changes the the length of one working period
    * @param _periodLength The new period length in seconds
    */
    function changePeriodLength(uint _periodLength)
        external
        isInitialized
        auth(MANAGE_TRACKING_ROLE)
    {
        require(_periodLength > 1);
        periodLength = _periodLength;
    }

    /**
    * @notice Changes the maximum amount of hours which can be tracked for
    *   one period
    * @param _maxHoursPerPeriod The new max hours
    */
    function changeMaxHoursPerPeriod(uint _maxHoursPerPeriod)
        external
        isInitialized
        auth(MANAGE_TRACKING_ROLE)
    {
        uint periodLengthHours = periodLength.div(60).div(60);
        require(_maxHoursPerPeriod > 0 && _maxHoursPerPeriod <= periodLengthHours);
        maxHoursPerPeriod = _maxHoursPerPeriod;
    }

    /**
    * @notice Tracks `_hours` amount of work hours
    * @param _hours Amount of hours to track
    */
    function trackWork(uint _hours) external isInitialized onlyMember {
        _trackWork(_hours);
    }

    function getPeriodsCountForAddress(address _address) external view returns(uint) {
        return addressToPeriods[_address].length;
    }

    /**
    * @notice Initializes TimeTracking app
    * @param _periodLength The length of one Work Period in seconds
    * @param _maxHoursPerPeriod The maximum amount of hours which can be tracked
    *   for one period
    */
    function initialize(
        IMembers _members,
        uint _periodLength,
        uint _maxHoursPerPeriod
        ) public onlyInit
    {
        members = _members;
        maxHoursPerPeriod = _maxHoursPerPeriod;
        periodLength = _periodLength;

        initialized();
    }

    /**
    * @dev Calls _createNewPeriod an address if the last one has passed,
    *   or if it doesn't exist
    */
    function _createNewPeriodIfItsTime(address _forAddress) internal {
        Period[] storage periods = addressToPeriods[_forAddress];

        if (periods.length == 0) {
            _createNewPeriod(_forAddress);
        } else {
            Period storage lastPeriod = periods[periods.length.sub(1)];
            if (lastPeriod.endTimestamp < now) {
                _createNewPeriod(_forAddress);
            }
        }
    }

    /**
    * @dev Creates a new Period for an address
    */
    function _createNewPeriod(address _forAddress) internal {
        Period[] storage periods = addressToPeriods[_forAddress];
        Period memory newPeriod = Period(now.add(periodLength), 0);
        uint periodsCount = periods.push(newPeriod);

        PeriodCreated(_forAddress, periodsCount, newPeriod.endTimestamp);
    }

    function _trackWork(uint _hours) internal {
        _createNewPeriodIfItsTime(msg.sender);

        Period[] storage periods = addressToPeriods[msg.sender];
        Period storage lastPeriod = periods[periods.length.sub(1)];
        require(lastPeriod.trackedHours.add(_hours) <= maxHoursPerPeriod);

        lastPeriod.trackedHours = lastPeriod.trackedHours.add(_hours);
        addressToTrackedHours[msg.sender] = addressToTrackedHours[msg.sender].add(_hours);

        HoursTracked(msg.sender, _hours);
    }
}
