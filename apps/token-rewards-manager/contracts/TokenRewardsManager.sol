pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/ITokenManager.sol";
import "./interfaces/IRewarder.sol";


contract TokenRewardsManager is ITokenManager, IRewarder, AragonApp {
    using SafeMath for uint256;

    event RewardGiven(address indexed sender, address indexed receiver, uint rewardAmount, uint rewardToDaoCourse);
    event RewardTokenMinted(address indexed receiver, uint amount);
    event DaoTokenMinted(address indexed receiver, uint amount);
    
    bytes32 constant public MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 constant public BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 constant public REWARD_ROLE = keccak256("REWARD_ROLE");
    
    MiniMeToken public rewardToken;
    MiniMeToken public daoToken;
    uint public rewardToDaoCourse;
    
    modifier onlyToken() {
        require(msg.sender == address(rewardToken) || msg.sender == address(daoToken));
        _;
    }
    
    /// @notice Initializes the app
    /// @param _rewardToken The address of the "MiniMeToken" to be used as a reward token
    /// @param _daoToken The address of the "MiniMeToken" to be used as a DAO token
    /// @param _rewardToDaoCourse The course which is used to convert reward tokens to DAO tokens
    function initialize(MiniMeToken _rewardToken, MiniMeToken _daoToken, uint _rewardToDaoCourse)
        external
        onlyInit
    {
        initialized();
        
        rewardToken = _rewardToken;
        daoToken = _daoToken;
        rewardToDaoCourse = _rewardToDaoCourse;
    }
    
    /// @notice Mints `_amount` of Reward tokens for `_receiver`    
    /// @param _receiver The address which receives reward tokens
    /// @param _amount The amount of reward tokens to be minted
    /// @return True if the minting was successful, false if it failed
    function mint(address _receiver, uint _amount) 
        external
        isInitialized
        auth(MINT_ROLE)
        returns (bool)
    {
        _mintRewardTokens(_receiver, _amount);
        return true;
    }
    
    /// @notice Burns `_amount` amount of reward tokens for `_owner`
    /// @param _owner The address to burn tokens from    
    /// @param _amount The amount of reward tokens to be given
    /// @return True if the reward was fulfilled, false if it failed
    function burn(address _owner, uint _amount) 
        external
        isInitialized
        auth(BURN_ROLE)
        returns (bool)
    {
        _burnRewardTokens(_owner, _amount);
        return true;
    }    
    
    /// @notice Gives `_amount * rewardToDaoCourse` amount of DAO tokens to `_receiver`
    /// @param _rewarder The address which gives the reward
    /// @param _receiver The address which receives the reward
    /// @param _amount The amount of reward tokens to be given
    /// @return True if the reward was fulfilled, false if it failed
    function reward(address _rewarder, address _receiver, uint _amount) 
        external
        isInitialized
        auth(REWARD_ROLE)
        returns (bool)
    {
        require(_rewarder != _receiver);
        
        _burnRewardTokens(_rewarder, _amount);
        uint daoTokensAmount = _amount.mul(rewardToDaoCourse);
        _mintDaoTokens(_receiver, daoTokensAmount);
        
        RewardGiven(_rewarder, _receiver, _amount, rewardToDaoCourse);
        return true;
    }

    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @param _owner The address that sent the ether to create tokens
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address _owner) 
        public
        payable
        onlyToken
        isInitialized 
        returns (bool)
    {
        return false;
    }
    
    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @param _from The origin of the transfer
    /// @param _to The destination of the transfer
    /// @param _amount The amount of the transfer
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address _from, address _to, uint _amount) 
        public 
        isInitialized
        onlyToken         
        returns (bool)
    {
        return false;
    }

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @param _owner The address that calls `approve()`
    /// @param _spender The spender in the `approve()` call
    /// @param _amount The amount in the `approve()` call
    /// @return False if the controller does not authorize the approval
    function onApprove(address _owner, address _spender, uint _amount)
        public        
        isInitialized
        onlyToken
        returns(bool)
    {
        return false;
    }    
    
    function _mintRewardTokens(address _receiver, uint _amount) internal {
        rewardToken.generateTokens(_receiver, _amount);
        RewardTokenMinted(_receiver, _amount);
    }
    
    function _burnRewardTokens(address _owner, uint _amount) internal {
        rewardToken.destroyTokens(_owner, _amount);
    }
    
    function _mintDaoTokens(address _receiver, uint _amount) internal {
        daoToken.generateTokens(_receiver, _amount);
        DaoTokenMinted(_receiver, _amount);
    }
    
    function _burnDaoTokens(address _owner, uint _amount) internal {
        daoToken.destroyTokens(_owner, _amount);
    }
}
