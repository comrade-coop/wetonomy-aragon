pragma solidity 0.4.18;

import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/ITokenManager.sol";
import "../../members/contracts/interfaces/IMembers.sol";


contract RewardTokenManager is ITokenManager {
    using SafeMath for uint256;
    
    event RewardTokensMinted(address indexed receiver, uint amount);
    event RewardTokensBurned(address indexed owner, uint amount);
    
    event InflationGenerated(uint amount);
    
    uint public inflationMultiplier;
    uint public inflationBalance;
    uint public totalInflationReleased;
    mapping(address => uint) public released;
    
    IMembers public members;
    
    MiniMeToken public rewardToken;
    
    modifier onlyToken() {
        require(msg.sender == address(rewardToken));
        _;
    }

    /// @notice Called when a member wants to claim his share of reward tokens
    function claimRewardTokens() external {
        var (memberAddress, , , memberReputation) = members.getMemberByAddress(msg.sender);
        uint membersCount = members.getMembersCount();

        require(memberAddress != address(0));
    
        uint totalReceived = inflationBalance.add(totalInflationReleased);
        uint256 inflationBase = totalReceived
            .div(membersCount)
            .sub(released[memberAddress]);
        
        require(inflationBase != 0);
        
        released[memberAddress] = released[memberAddress].add(inflationBase);
        totalInflationReleased = totalInflationReleased.add(inflationBase);
        inflationBalance = inflationBalance.sub(inflationBase);
        
        uint rewardsAmount = inflationBase.mul(memberReputation);
        _mintRewardTokens(memberAddress, rewardsAmount);
    }

    function setInflationMultiplier(uint _multiplier) external {
        inflationMultiplier = _multiplier;
    }
    
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address) 
        public
        payable
        onlyToken
        returns (bool)
    {
        return false;
    }
    
    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address, address, uint) 
        public
        onlyToken         
        returns (bool)
    {
        return false;
    }

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @return False if the controller does not authorize the approval
    function onApprove(address, address, uint)
        public
        onlyToken
        returns(bool)
    {
        return false;
    }    
    
    function _generateInflation(uint _amount) 
        internal
        returns (bool)
    {
        uint membersCount = members.getMembersCount();
        uint inflation = _amount.mul(membersCount).mul(inflationMultiplier);

        require(inflation > 0);

        inflationBalance = inflationBalance.add(inflation);
        InflationGenerated(inflation);
        return true;
    }
    
    function _mintRewardTokens(address _receiver, uint _amount) internal {
        rewardToken.generateTokens(_receiver, _amount);
        RewardTokensMinted(_receiver, _amount);
    }
    
    function _burnRewardTokens(address _owner, uint _amount) internal {
        rewardToken.destroyTokens(_owner, _amount);
        RewardTokensBurned(_owner, _amount);
    }
}