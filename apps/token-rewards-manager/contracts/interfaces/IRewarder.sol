pragma solidity 0.4.24;


interface IRewarder {
    function reward(address _rewarder, address _receiver, uint _amount) external returns (bool);
    function claimRewardTokensFor(address _receiver) external returns (bool);
    function getUserBalance(address _from) external view returns (uint, uint);
}