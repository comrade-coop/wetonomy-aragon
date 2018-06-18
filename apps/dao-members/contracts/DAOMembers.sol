pragma solidity ^0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

contract DAOMembers is AragonApp {
    using SafeMath for uint256;
    
    event NewMember(address indexed accountAddress, string name, Level level);
    event MemberRemoved(uint indexed index, address indexed accountAddress, string name, Level level);
    
    enum Level { BEGINNER, INTERMEDIATE, EXPERT }
    
    bytes32 ADD_MEMBERS_ROLE = keccak256("ADD_MEMBERS_ROLE");
    bytes32 REMOVE_MEMBERS_ROLE = keccak256("REMOVE_MEMBERS_ROLE");
    bytes32 CHANGE_LEVEL_ROLE = keccak256("CHANGE_LEVEL_ROLE");
    bytes32 CHANGE_ADDRESS_ROLE = keccak256("CHANGE_ADDRESS_ROLE");

    struct Member {
        address accountAddress;
        string name;
        Level level;
    }
    
    Member[] members;
    mapping(address => Member) addressToMember;
    
    function addMember(address _accountAddress, string _name, Level _level) auth(ADD_MEMBERS_ROLE) public {
        _addMember(_accountAddress, _name, _level);
    }
    
    function removeMember(uint _id) auth(REMOVE_MEMBERS_ROLE) public {
        _removeMember(_id);
    }
    
    function getMemberCount() public view returns(uint256) {
        return members.length;
    }
    
    function getMember(uint _id) public view returns(address accountAddress, string name, Level level) {
        Member memory member = members[_id];
        accountAddress = member.accountAddress;
        name = member.name;
        level = member.level;
    }
    
    function changeMemberAddress(uint _id, address _newAddress) auth(CHANGE_ADDRESS_ROLE) public {
        Member storage member = members[_id];
        
        // require(_newAddress != address(0) && !memberExists[_newAddress]);
        require(member.accountAddress != address(0));
        
        member.accountAddress = _newAddress;
    }
    
    function changeMemberLevel(uint _id, Level _newLevel) auth(CHANGE_LEVEL_ROLE) public {
        Member storage member = members[_id];
        
        require(member.accountAddress != address(0));
        
        member.level = _newLevel;
    }
    
    function _addMember(address _accountAddress, string _name, Level _level) internal {
        require(_accountAddress != address(0));
        // require(!memberExists[_accountAddress]);
        
        Member memory newMember = Member(_accountAddress, _name, _level);
        members.push(newMember);
        // memberExists[_accountAddress] = true;
        
        NewMember(_accountAddress, _name, _level);
    }
    
    function _removeMember(uint _id) internal {
        uint count = members.length;
        require(_id < count);
        
        Member memory memberToRemove = members[_id];
        
        if (_id != count - 1) {
            members[_id] = members[count - 1];
            _id = count - 1;
        }
        
        delete members[_id];
        members.length--;
        
        // memberExists[memberToRemove.accountAddress] = true;
        
        MemberRemoved(
            _id, 
            memberToRemove.accountAddress,
            memberToRemove.name,
            memberToRemove.level
        );
    }

    function isMember(address _member) public view returns(bool) {
        // return memberExists[_member];
        return true;
    }
}
