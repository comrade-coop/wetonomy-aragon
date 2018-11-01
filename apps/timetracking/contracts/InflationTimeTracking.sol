pragma solidity 0.4.24;

import "./TimeTracking.sol";
import "../../token-rewards-manager/contracts/interfaces/IRewardTokenManager.sol";
import "../../members/contracts/interfaces/IMembers.sol";


contract InflationTimeTracking is TimeTracking {
    IRewardTokenManager public tokenManager;

    event TokensClaimed(address from);
    event Inflation(uint inflationBalance, uint totalInflationReleased);

    /**
    * @notice Initializes TimeTracking app
    * @param _periodLength The length of one Work Period in seconds
    * @param _maxHoursPerPeriod The maximum amount of hours which can be tracked
    *   for one period
    */
    function initialize(
        IRewardTokenManager _tokenManager,
        IMembers _members,
        uint _periodLength,
        uint _maxHoursPerPeriod)
        external
        onlyInit
    {
        super.initialize(_members, _periodLength, _maxHoursPerPeriod);
        tokenManager = _tokenManager;
    }
    
    function trackWork(uint _hours) external isInitialized onlyMember {
        _trackWork(_hours);
    }

    function claim() external isInitialized onlyMember {
        require(tokenManager.claimRewardTokensFor(msg.sender));
        emit TokensClaimed(msg.sender);
    }

    function trackAndClaim(uint _hours) external isInitialized onlyMember {
        _trackWork(_hours);
        require(tokenManager.claimRewardTokensFor(msg.sender));
        emit TokensClaimed(msg.sender);
    }

    function getBalance(address from) external view returns (uint, uint) {
        return tokenManager.getUserBalance(from);
    }

    function _trackWork(uint _hours) internal {
        TimeTracking._trackWork(_hours);
        tokenManager.mint(_hours);
    }
}
