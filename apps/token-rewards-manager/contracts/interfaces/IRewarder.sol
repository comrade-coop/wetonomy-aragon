pragma solidity 0.4.18;


interface IRewarder {
    function reward(address _rewarder, address _receiver, uint _amount) external returns (bool);
}