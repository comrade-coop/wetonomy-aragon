pragma solidity ^0.4.4;

import "../../dao-members/contracts/DAOMembers.sol";


contract P2PRewards is AragonApp {
    using SafeMath for uint256;
    
    event RewardGiven(address _from, address _to, uint _amount, string _reason);
    
    DAOMembers members;
    
    struct RewardHistoryItem {
        address from;
        address to;
        address amount;
        address reason;
    }
    
    modifier isMember(address _address) {
        // TODO: implement isMember modifier
        _;
    }
    
    mapping(address => uint) rewardPointsBalance;
    RewardHistoryItem[] rewardHistory;
    
    uint lastRewardIssueTimestamp;
    
    function reloadRewardBalances() public {
        _reloadRewardBalances();
    }
    
    function giveReward(address _to, uint _amount, string _reason) isMember(msg.sender) isMember(_to) public {
        
    }
    
    function getRewardHistoryIndexesForMember(address _member) public view returns(uint[] rewardIndexes) {
        // Traverse over rewardHistory
        // return indexes
    }
    
    function getRewardHistoryItem(uint _index) public view
        returns(address from, address to, address amount, address reason) {
        return rewardHistory[_index];
    }
    
    function pointsBalanceOf(address _member) public view {
        return rewardPointsBalance[_member];
    }
    
    function _reloadRewardBalances() internal {
        
    }
    
    function _giveReward
}
