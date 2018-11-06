pragma solidity 0.4.24;


interface IRewarder {
    function reward(address _rewarder, address _receiver, uint _amount) external returns (bool);
    function claimRewardTokens(address sender) external returns (bool);
    function getUserBalance(address from) external view returns (uint, uint);
}