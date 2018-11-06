pragma solidity 0.4.24;

import "@aragon/os/contracts/kernel/Kernel.sol";
import "@aragon/apps-shared-minime/contracts/MiniMeToken.sol";

interface IRewardsKit {
    function newInstance(MiniMeToken _rewardToken, MiniMeToken _daoToken) external returns (Kernel);
    function createDAOTokens(
        string _rewardTokenName,
        uint8 _rewardTokenDecimals,
        string _rewardTokenSymbol,
        string _daoTokenName,
        uint8 _daoTokenDecimals,
        string _daoTokenSymbol)
        external
        returns (MiniMeToken, MiniMeToken);
}