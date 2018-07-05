pragma solidity ^0.4.24;

contract MembersBase {
    
    struct Member {
        address accountAddress;
        string name;
    }
    
    function addMember(address _address, string _name) external;
    function removeMember(uint _id) external;
    
    function getMembersCount() public view returns (uint);
}