pragma solidity 0.4.18;

import "./TimeTracking.sol";
import "../../token-rewards-manager/contracts/interfaces/ITokenManager.sol";
import "../../members/contracts/interfaces/IMembers.sol";


contract InflationTimeTracking is TimeTracking {
    
    ITokenManager public tokenManager;

    /**
    * @notice Initializes TimeTracking app
    * @param _periodLength The length of one Work Period in seconds
    * @param _maxHoursPerPeriod The maximum amount of hours which can be tracked 
    *   for one period
    */
    function initialize(
        ITokenManager _tokenManager,
        IMembers _members,
        uint _periodLength, 
        uint _maxHoursPerPeriod)
        external 
        onlyInit
    {
        super.initialize(_members, _periodLength, _maxHoursPerPeriod);
        tokenManager = _tokenManager;
    }
    
    function _trackWork(uint _hours) internal {
        TimeTracking._trackWork(_hours);
        tokenManager.mint(_hours);
    }
}
