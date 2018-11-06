pragma solidity 0.4.24;

import "@aragon/apps-shared-minime/contracts/ITokenController.sol";


contract ITokenManager is ITokenController {
    function mint(uint _amount) external returns (bool);
    function burn(address _owner, uint _amount) external returns (bool);
    function transfer(address _owner, address _receiver, uint _amount) external returns (bool);
}