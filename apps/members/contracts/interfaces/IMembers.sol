pragma solidity 0.4.24;

import "../models/MemberModel.sol";


contract IMembers is MemberModel {
    function addMember(address _address, string _name, Level _level) external;
    
    function setMemberLevel(uint _id, Level _level) external;
    
    function setMemberAddress(uint _id, address _address) external;
    
    function setMemberName(uint _id, string _name) external;
    
    function setMemberReputation(uint _id, uint _reputation) external;
    
    function removeMember(uint _id) external;

    function getMembersCount() external view returns (uint);
    
    function getMember(uint _id) 
        public
        view 
        returns (address, string, Level, uint);

    function getMemberByAddress(address _address) 
        public
        view
        returns (address, string, Level, uint);
}