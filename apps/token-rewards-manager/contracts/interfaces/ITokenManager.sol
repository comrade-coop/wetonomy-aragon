pragma solidity 0.4.18;


import "@aragon/os/contracts/lib/minime/ITokenController.sol";


contract ITokenManager is ITokenController {
    function mint(address _receiver, uint _amount) external returns (bool);
    function burn(address _owner, uint _amount) external returns (bool);
}