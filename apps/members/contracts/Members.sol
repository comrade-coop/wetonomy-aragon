pragma solidity ^0.4.18;

import "./interfaces/IMembers.sol";
import "../node_modules/@aragon/os/contracts/apps/AragonApp.sol";

contract Members is IMembers, AragonApp {
    
    event MemberAdded(uint indexed id, address indexed accountAddress, string name);
    event MemberRemoved(address indexed accountAddress, string name);
    
    bytes32 constant public MANAGE_MEMBERS_ROLE = keccak256("MANAGE_MEMBERS_ROLE");
    
    mapping(address => Member) public addressToMember;
    address[] public memberAddresses;
    
    modifier isMemberByAddress(address _address) {
        Member storage member = addressToMember[_address];
        require(member.accountAddress != address(0));
        _;
    }
    
    modifier isMemberById(uint _id) {
        address memberAddress = memberAddresses[_id];
        require(memberAddress != address(0));
        _;
    }
    
    function addMember(address _address, string _name, Level _level) external {
        _addMember(_address, _name, _level);
    }
    
    function removeMember(uint _id) external {
        _removeMember(_id);
    }
    
    function setMemberLevel(uint _id, Level _level) 
        isMemberById(_id) 
        auth(MANAGE_MEMBERS_ROLE) 
        external 
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.level = _level;
    }
    
    function setMemberAddress(uint _id, address _address)
        auth(MANAGE_MEMBERS_ROLE)
        isMemberById(_id)
        external
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.accountAddress = _address;
    }
    
    function setMemberName(uint _id, string _name) 
        auth(MANAGE_MEMBERS_ROLE)
        isMemberById(_id)
        external
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.name = _name;
    }
    
    function getMembersCount() external view returns (uint) {
        return memberAddresses.length;
    }
    
    function getMemberByAddress(address _address) 
        external 
        view 
        returns (address accountAddress, string name, Level level) 
    {
        Member storage member = addressToMember[_address];
        accountAddress = member.accountAddress;
        name = member.name;
        level = member.level;
    }
    
    function getMember(uint _id)
        external
        view 
        returns (address accountAddress, string name, Level level) {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        accountAddress = member.accountAddress;
        name = member.name;
        level = member.level;
    }
    
    function _addMember(address _address, string _name, Level _level) 
        auth(MANAGE_MEMBERS_ROLE)
        internal
    {
        require(addressToMember[_address].accountAddress == address(0));
        require(isValidMember(_address, _name));
        
        uint id = memberAddresses.push(_address) - 1;
        Member memory member = Member(_address, _name, _level);
        addressToMember[_address] = member;
        MemberAdded(id, _address, _name);
    }
    
    function _removeMember(uint _id) 
        auth(MANAGE_MEMBERS_ROLE)
        isMemberById(_id)
        internal
    {
        address memberAddress = memberAddresses[_id];
        Member memory member = addressToMember[memberAddress];
        uint lastMemberId = memberAddresses.length - 1;
        
        delete addressToMember[memberAddress];
        delete memberAddresses[_id];
        if (_id != lastMemberId) {
            memberAddresses[_id] = memberAddresses[lastMemberId];
            delete memberAddresses[lastMemberId];
        }
        memberAddresses.length--;
        
        MemberRemoved(member.accountAddress, member.name);
    }
}