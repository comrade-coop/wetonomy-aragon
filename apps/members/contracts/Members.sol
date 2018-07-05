pragma solidity ^0.4.24;

import "./baseContracts/MembersBase.sol";
import "../node_modules/@aragon/os/contracts/apps/AragonApp.sol";
import "./lib/Strings.sol";

contract Members is MembersBase, AragonApp {
    using Strings for string;
    
    event MemberAdded(uint indexed id, address indexed accountAddress, string name);
    event MemberRemoved(address indexed accountAddress, string name);
    
    uint8 MIN_NAME_LENGTH = 3;
    uint8 MAX_NAME_LENGTH = 30;
    
    mapping(address => bool) public memberExists;
    Member[] public members;
    
    
    bytes32 constant public MANAGE_MEMBERS_ROLE = keccak256("MANAGE_MEMBERS_ROLE");
    
    function addMember(address _address, string _name) external {
        _addMember(_address, _name);
    }
    
    function removeMember(uint _id) external {
        _removeMember(_id);
    }
    
    function getMembersCount() public view returns (uint) {
        return members.length;
    }
    
    function _addMember(address _address, string _name) internal auth(MANAGE_MEMBERS_ROLE) {
        require(_address != address(0));
        require(!memberExists[_address]);
        uint nameLength = _name.length();
        require(nameLength >= MIN_NAME_LENGTH && nameLength <= MAX_NAME_LENGTH);
        
        uint id = members.push(Member(_address, _name)) - 1;
        memberExists[_address] = true;
        emit MemberAdded(id, _address, _name);
    }
    
    function _removeMember(uint _index) internal auth(MANAGE_MEMBERS_ROLE) {
        require(_index < members.length);
        Member memory member = members[_index];
        require(memberExists[member.accountAddress]);
        
        uint lastMemberIndex = members.length - 1;
        memberExists[member.accountAddress] = false;
        delete members[_index];
        if (_index != lastMemberIndex) {
            members[_index] = members[lastMemberIndex];
            delete members[lastMemberIndex];
        }
        members.length--;
        
        emit MemberRemoved(member.accountAddress, member.name);
    }
}