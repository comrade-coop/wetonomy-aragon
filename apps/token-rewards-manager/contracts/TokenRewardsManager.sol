pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/IRewardTokenManager.sol";
import "../../members/contracts/interfaces/IMembers.sol";


contract TokenRewardsManager is IRewardTokenManager, AragonApp {
    using SafeMath for uint256;

    event RewardGiven(address sender, address receiver, uint rewardAmount, uint rewardToDaoCourse);
    event DaoTokensMinted(address indexed receiver, uint amount);
    event DaoTokensBurned(address indexed owner, uint amount);
    event RewardTokensMinted(address indexed receiver, uint amount);
    event RewardTokensBurned(address indexed owner, uint amount);
    event InflationGenerated(uint amount);

    bytes32 constant public MINT_ROLE = keccak256("MINT_ROLE");
    bytes32 constant public BURN_ROLE = keccak256("BURN_ROLE");
    bytes32 constant public TRANSFER_ROLE = keccak256("TRANSFER_ROLE");
    bytes32 constant public REWARD_ROLE = keccak256("REWARD_ROLE");
    bytes32 constant public MANAGE_TOKENMANAGER_ROLE = keccak256("MANAGE_TOKENMANAGER_ROLE");

    IMembers public members;
    MiniMeToken public rewardToken;
    MiniMeToken public daoToken;

    uint public inflationMultiplier;
    uint public inflationBalance;
    uint public totalInflationReleased;
    mapping(address => uint) public released;

    uint public rewardToDaoCourse;

    modifier onlyToken() {
        require(msg.sender == address(rewardToken) || msg.sender == address(daoToken));
        _;
    }

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
        inflationMultiplier = _inflationMultiplier;
        rewardToDaoCourse = _rewardToDaoCourse;
        initialized();
    }

    /**
    * @notice Changes the value of inflation multiplier
    *   one period
    * @param _inflationMultiplier The new multiplier
    */
    function changeInflationMultiplier(uint _inflationMultiplier)
        external
        isInitialized
        // auth(MANAGE_TOKENMANAGER_ROLE)
    {
        inflationMultiplier = _inflationMultiplier;
    }

    function changeRewardToDaoCourse(uint _rewardToDaoCourse)
        external
        isInitialized
        // auth(MANAGE_TOKENMANAGER_ROLE)
    {
        rewardToDaoCourse = _rewardToDaoCourse;
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

    /// @notice Transfers `_amount` amount of reward tokens from `_owner` to `_receiver`
    /// @param _from The address to transfer tokens from
    /// @param _to The address to transfer tokens to
    /// @param _amount The amount of tokens to transfer
    /// @return True if the transfer was fulfilled
    function transfer(address _from, address _to, uint _amount)
        external
        isInitialized
        //auth(TRANSFER_ROLE)
        returns (bool)
    {
        return rewardToken.transferFrom(_from, _to, _amount);
    }

    /// @notice Gives `_amount * rewardToDaoCourse` amount of DAO tokens to `_receiver`
    /// @param _rewarder The address which gives the reward
    /// @param _receiver The address which receives the reward
    /// @param _amount The amount of reward tokens to be given
    /// @return True if the reward was fulfilled, false if it failed
    function reward(address _rewarder, address _receiver, uint _amount)
        external
        isInitialized
        // auth(REWARD_ROLE)
        returns (bool)
    {
        require(_rewarder != _receiver);

        _burnRewardTokens(_rewarder, _amount);
        uint daoTokensAmount = _amount.mul(rewardToDaoCourse);
        _mintDaoTokens(_receiver, daoTokensAmount);

        RewardGiven(_rewarder, _receiver, _amount, rewardToDaoCourse);
        return true;
    }

    /// @notice Called when a member wants to claim his share of reward tokens
    function claimRewardTokens(address sender) external returns (bool) {
        var (memberAddress, , , memberReputation) = members.getMemberByAddress(sender);
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
        return _mintRewardTokens(memberAddress, rewardsAmount);
    }

    function getUserBalance(address from) external view returns (uint, uint) {
        return (rewardToken.balanceOf(from), daoToken.balanceOf(from));
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
        if (msg.sender == address(rewardToken)) {
            return true;
        }
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

    function _mintRewardTokens(address _receiver, uint _amount) internal returns (bool) {
        require(rewardToken.generateTokens(_receiver, _amount));
        RewardTokensMinted(_receiver, _amount);
        return true;
    }

    function _burnRewardTokens(address _owner, uint _amount) internal {
        rewardToken.destroyTokens(_owner, _amount);
        RewardTokensBurned(_owner, _amount);
    }

    function _mintDaoTokens(address _receiver, uint _amount) internal {
        daoToken.generateTokens(_receiver, _amount);
        DaoTokensMinted(_receiver, _amount);
    }

    function _burnDaoTokens(address _owner, uint _amount) internal {
        daoToken.destroyTokens(_owner, _amount);
        DaoTokensBurned(_owner, _amount);
    }
}