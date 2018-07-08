pragma solidity ^0.4.18;

import "../models/MemberModel.sol";

contract IMembers is MemberModel {
    function addMember(address _address, string _name, Level _level) external;
    function removeMember(uint _id) external;
    function getMembersCount() external view returns (uint);
    function getMemberByAddress(address _address) 
        external
        view
        returns (address, string, Level);
}