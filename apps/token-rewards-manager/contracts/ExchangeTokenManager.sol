pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/ITokenManager.sol";
import "./interfaces/IRewarder.sol";
import "./RewardTokenManager.sol";
import "./DaoTokenManager.sol";


contract ExchangeTokenManager is 
    RewardTokenManager, 
    DaoTokenManager, 
    IRewarder, 
    AragonApp {
        
    using SafeMath for uint256;

    event RewardGiven(
        address indexed sender, 
        address indexed receiver,
        uint rewardAmount,
        uint rewardToDaoCourse
    );
    
    bytes32 constant public MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 constant public BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 constant public REWARD_ROLE = keccak256("REWARD_ROLE");

    uint public rewardToDaoCourse;
    
    /// @notice Initializes the app
    /// @param _members The address of the Members contract to be used for rewards
    /// @param _rewardToken The address of the "MiniMeToken" to be used as a reward token
    /// @param _daoToken The address of the "MiniMeToken" to be used as a DAO token
    /// @param _rewardToDaoCourse The course which is used to convert reward tokens to DAO tokens
    function initialize(
        IMembers _members,
        MiniMeToken _rewardToken, 
        MiniMeToken _daoToken, 
        uint _rewardToDaoCourse,
        uint _inflationMultiplier)
        external
        onlyInit
    {       
        members = _members;
        rewardToken = _rewardToken;
        daoToken = _daoToken;        
        rewardToDaoCourse = _rewardToDaoCourse;
        inflationMultiplier = _inflationMultiplier;

        initialized();
    }
    
    /// @notice Mints `_amount` of "inflation" for the DAO
    /// @param _amount The amount of reward tokens to be minted
    /// @return True if the minting was successful, false if it failed
    function mint(uint _amount) 
        external
        isInitialized
        auth(MINT_ROLE)
        returns (bool)
    {
        _generateInflation(_amount);
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
}
