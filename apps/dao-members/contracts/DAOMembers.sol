pragma solidity ^0.4.18;

import "../node_modules/@aragon/os/contracts/apps/AragonApp.sol";
import "../node_modules/@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";

contract DAOMembers is AragonApp {
    using SafeMath for uint256;
    
    event NewMember(address indexed wallet, string name, Level level);
    event MemberRemoved(uint indexed index, address indexed wallet, string name, Level level);
    
    enum Level { BEGINNER, INTERMEDIATE, EXPERT }
    
    bytes32 PERMISSION_MANAGE_MEMBERS = keccak256("PERMISSION_MANAGE_MEMBERS");

    struct Member {
        address wallet;
        string name;
        Level level;
    }
    
    Member[] members;
    
    function addMember(address _wallet, string _name, Level _level) auth(PERMISSION_MANAGE_MEMBERS) public {
        _addMember(_wallet, _name, _level);
    }
    
    function removeMember(uint _index) auth(PERMISSION_MANAGE_MEMBERS) public {
        _removeMember(_index);
    }
    
    function getMemberCount() public view returns(uint256) {
        return members.length;
    }
    
    function getMember(uint _index) public view returns(address wallet, string name, Level level) {
        Member memory member = members[_index];
        wallet = member.wallet;
        name = member.name;
        level = member.level;
    }
    
    // function changeMemberWallet() auth(PERMISSION_MANAGE_MEMBERS) public {
        
    // }
    
    // function changeMemberName() auth(PERMISSION_MANAGE_MEMBERS) {
        
    // }
    
    // function changeMemberLevel() auth(PERMISSION_MANAGE_MEMBERS) {
        
    // }
    
    function _addMember(address _wallet, string _name, Level _level) internal {
        Member memory newMember = Member(_wallet, _name, _level);
        members.push(newMember);
        
        emit NewMember(_wallet, _name, _level);
    }
    
    function _removeMember(uint _index) internal {
        uint count = members.length;
        require(_index < count);
        
        Member memory memberToRemove = members[_index];
        
        if (_index != count - 1) {
            members[_index] = members[count - 1];
            _index = count - 1;
        }
        
        delete members[_index];
        members.length--;
        
        emit MemberRemoved(
            _index, 
            memberToRemove.wallet,
            memberToRemove.name,
            memberToRemove.level
        );
    }
}
