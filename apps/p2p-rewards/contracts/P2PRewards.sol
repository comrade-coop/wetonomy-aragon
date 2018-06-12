pragma solidity ^0.4.4;

import "../../dao-members/contracts/DAOMembers.sol";
import "../node_modules/@aragon/os/contracts/lib/minime/MiniMeToken.sol";


contract P2PRewards is AragonApp {
    using SafeMath for uint256;
    
    event RewardGiven(address _from, address _to, uint _amount, string _reason);
    
    uint DEFAULT_REFRESH_RATE = 4 weeks;
    uint MAX_REASON_LENGTH = 50;
    
    struct RewardHistoryItem {
        address from;
        address to;
        uint amount;
        string reason;
    }
    
    DAOMembers members;
    MiniMeToken token;
    uint refreshRate;
    uint initialPoints;
    mapping(address => uint) rewardPointsBalance;
    mapping(address => uint) memberToLastRefreshTimestamp;
    RewardHistoryItem[] rewardHistory;
    
    modifier onlyMember(address _address) {
        require(members.isMember(_address));
        _;
    }
    
    function initialize(MiniMeToken _token, uint _refreshRate, uint _initialPoints) onlyInit external {
        require(_initialPoints > 0);
        
        token = _token;
        refreshRate = _refreshRate > 0 ? _refreshRate : DEFAULT_REFRESH_RATE;
        initialPoints = _initialPoints;
        
        initialized();
    }
    
    function refreshBalance(address _address) onlyMember(_address) external {
        _refreshBalance(_address);
    }
    
    function giveReward(address _to, uint _amount, string _reason) onlyMember(msg.sender) onlyMember(_to) public {
        _giveReward(_to, _amount, _reason);
    }
    
    function getRewardHistoryIndexesForMember(address _member) public view returns(uint[] rewardIndexes) {
        for (uint i = 0; i < rewardHistory.length; i++) {
            RewardHistoryItem storage historyItem = rewardHistory[i];
            if (historyItem.from == _member || historyItem.to == _member) {
                // rewardIndexes.push(i);
            }
        }
    }
    
    function getRewardHistoryItem(uint _index) public view
        returns(address from, address to, uint amount, string reason) {
        from = rewardHistory[_index].from;
        to = rewardHistory[_index].to;
        amount = rewardHistory[_index].amount;
        reason= rewardHistory[_index].reason;
    }
    
    function rewardPointsBalanceOf(address _member) public view returns(uint) {
        return rewardPointsBalance[_member];
    }
    
    function shouldRefreshPoints(address _member) public view returns(bool) {
        uint lastRefresh = memberToLastRefreshTimestamp[_member];
        return now > lastRefresh + refreshRate || lastRefresh == 0;
    }
    
    function _giveReward(address _to, uint _amount, string _reason) internal {
        require(!shouldRefreshPoints(msg.sender));
        require(_amount > 0);
        require(bytes(_reason).length < MAX_REASON_LENGTH);
        
        _burnPoints(msg.sender, _amount);
        token.generateTokens(_to, _amount);
        
        emit RewardGiven(msg.sender, _to, _amount, _reason);
    }
    
    function _burnPoints(address _owner, uint _amount) internal {
        require(rewardPointsBalance[_owner] > _amount && _amount > 0);
        
        rewardPointsBalance[_owner] = rewardPointsBalance[_owner].sub(_amount);
    }
    
    function _refreshBalance(address _address) onlyMember(_address) internal {
        require(shouldRefreshPoints(_address));
        rewardPointsBalance[_address] = initialPoints;
    }
}
