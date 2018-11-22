pragma solidity 0.4.24;

import "@aragon/os/contracts/apm/APMNamehash.sol";


contract APMNamehashOpen is APMNamehash {
    bytes32 public constant OPEN_TITLE = keccak256("open");
    bytes32 public constant OPEN_APM_NODE = keccak256(abi.encodePacked(APM_NODE, OPEN_TITLE));

    function apmNamehashOpen(string name) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(OPEN_APM_NODE, keccak256(name)));
    }
}
