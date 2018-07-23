pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract TimeTracking is AragonApp {

    event HoursTracked(address indexed ownerAddress, uint64 trackedHours);

    mapping(address => uint) public addressToTrackedHours;
    uint public totalHours;
    
    bytes32 constant public MANAGE_TASK_ROLE = keccak256("MANAGE_TASK_ROLE");

    function trackHours(uint64 _hours) external { //auth(MANAGE_TASK_ROLE)
        addressToTrackedHours[msg.sender] += _hours;
        totalHours += _hours;
        HoursTracked(msg.sender, _hours);
    }
}