pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/IUnitsOfWork.sol";


contract TimeTracking is IUnitsOfWork, AragonApp {
    using SafeMath for uint256;

    event HoursTracked(address indexed ownerAddress, uint trackedHours);
    
    struct Period {
        uint endTimestamp;
        uint trackedHours;
    }
    
    bytes32 constant public MANAGE_TRACKING_ROLE = 
        keccak256("MANAGE_TRACKING_ROLE");
    
    uint public periodLength;
    uint public maxHoursPerPeriod;
    mapping (address => Period[]) public addressToPeriods;
    mapping(address => uint) public addressToTrackedHours;
    
    /**
    * @notice Initializes TimeTracking app
    * @param _periodLength The length of one Work Period in seconds
    * @param _maxHoursPerPeriod The maximum amount of hours which can be tracked 
    *   for one period
    */
    function initialize(uint _periodLength, uint _maxHoursPerPeriod) 
        external 
        onlyInit
    {
        initialized();
        maxHoursPerPeriod = _maxHoursPerPeriod;
        periodLength = _periodLength;
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
        maxHoursPerPeriod = _maxHoursPerPeriod;
    }
    
    /**
    * @notice Tracks `_hours` amount of work hours
    * @param _hours Amount of hours to track
    */
    function trackWork(uint _hours) external isInitialized {
        _createNewPeriodIfItsTime(msg.sender);

        Period[] storage periods = addressToPeriods[msg.sender];
        Period storage lastPeriod = periods[periods.length.sub(1)];        
        require(lastPeriod.trackedHours.add(_hours) <= maxHoursPerPeriod);
        
        lastPeriod.trackedHours = lastPeriod.trackedHours.add(_hours);
        addressToTrackedHours[msg.sender] = addressToTrackedHours[msg.sender].add(_hours);
        
        HoursTracked(msg.sender, _hours);
    }

    function getPeriodsCountForAddress(address _address) 
        external 
        view
        returns(uint) 
    {
        return addressToPeriods[_address].length;
    }
    
    /**
    * @dev Creates a new Period for an address if the last one has passed, 
    *   or if it doesn't exist'
    */
    function _createNewPeriodIfItsTime(address _address) internal {
        Period[] storage periods = addressToPeriods[_address];
        
        if (periods.length == 0) {
            periods.push(Period(now.add(periodLength), 0));
        }
        
        Period storage lastPeriod = periods[periods.length.sub(1)];
        
        if (lastPeriod.endTimestamp < now) {
            periods.push(Period(now.add(periodLength), 0));            
        }
    }
}