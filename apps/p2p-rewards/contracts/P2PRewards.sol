pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
// import "../../dao-members/contracts/DAOMembers.sol";

// TODO: Import real TokenManager
// This is a mock TokenManager
contract TokenManager {
    function mint(address _receiver, uint _amount) public {
        // Mint tokens...
    }
}

contract P2PRewards is AragonApp {
    using SafeMath for uint256;
    
    event PointsRefresh(address member, uint timestamp);
    event RewardGiven(address from, address to, uint amount, string reason);
    
    bytes32 constant public REFRESH_POINTS_ROLE = keccak256("REFRESH_POINTS_ROLE");
    bytes32 constant public GIVE_REWARD_ROLE = keccak256("GIVE_REWARD_ROLE");
    
    uint DEFAULT_REFRESH_RATE = 4 weeks;
    uint MAX_REASON_LENGTH = 50;
    
    struct RewardHistoryItem {
        address from;
        address to;
        uint amount;
        string reason;
    }
    
    // DAOMembers members;
    TokenManager tokenManager;
    uint refreshRate;
    uint initialPoints;
    mapping(address => uint) rewardPointsBalance;
    mapping(address => uint) memberToLastRefreshTimestamp;
    
    RewardHistoryItem[] rewardHistory;
    mapping(address => uint[]) memberToHistoryItems;

    modifier onlyMember(address _address) {
        // require(members.isMember(_address));
        _;
    }
    
    function initialize(TokenManager _tokenManager, uint _refreshRate, uint _initialPoints) onlyInit external {
        require(_initialPoints > 0);
        
        tokenManager = _tokenManager;
        refreshRate = _refreshRate > 0 ? _refreshRate : DEFAULT_REFRESH_RATE;
        initialPoints = _initialPoints;
        
        initialized();
    }
    
    function refreshPoints(address _member) auth(REFRESH_POINTS_ROLE) public {
        require(shouldRefreshPoints(_member));
        
        memberToLastRefreshTimestamp[_member] = now;
        rewardPointsBalance[_member] = initialPoints;
        
        PointsRefresh(_member, now);
    }
    
    function giveReward(address _to, uint _amount, string _reason) auth(GIVE_REWARD_ROLE) public {
        _giveReward(_to, _amount, _reason);
    }
    
    function getRewardHistoryIndexesForMember(address _member) 
        public 
        view 
        returns(uint[]) {
        return memberToHistoryItems[_member];
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
        require(_to != msg.sender);
        
        require(_amount > 0);
        require(bytes(_reason).length < MAX_REASON_LENGTH);
        
        _burnPoints(msg.sender, _amount);
        tokenManager.mint(_to, _amount);
        
        RewardHistoryItem memory historyItem = RewardHistoryItem(
            msg.sender,
            _to,
            _amount,
            _reason
        );
        uint historyItemIndex = rewardHistory.push(historyItem) - 1;
        memberToHistoryItems[msg.sender].push(historyItemIndex);
        memberToHistoryItems[_to].push(historyItemIndex);
        
        RewardGiven(msg.sender, _to, _amount, _reason);
    }
    
    function _burnPoints(address _owner, uint _amount) internal {
        require(rewardPointsBalance[_owner] > _amount && _amount > 0);
        
        rewardPointsBalance[_owner] = rewardPointsBalance[_owner].sub(_amount);
    }
}
