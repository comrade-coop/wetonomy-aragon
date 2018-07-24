pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./interfaces/IMembers.sol";


contract Members is IMembers, AragonApp {
    
    event MemberAdded(uint indexed id, address indexed accountAddress, string name);
    event MemberUpdated(uint indexed id);
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
    
    /**
     * @notice Add a new Member to the organisation     
     * @param _address Address of the member
     * @param _name Name of the member
     * @param _level Experience level for the member. Must be a value between 0 and 3
     */
    function addMember(address _address, string _name, Level _level) external {
        _addMember(_address, _name, _level);
    }
    
    /**
     * @notice Remove a member from the organisation
     * @param _id The id of the Member     
     */
    function removeMember(uint _id) external {
        _removeMember(_id);
    }
    
    /**
     * @notice Set the level of a Member in an organisation
     * @param _id The id of the Member
     * @param _level The new experience level for the member. Must be a value between 0 and 3
     */
    function setMemberLevel(uint _id, Level _level) 
        external
        auth(MANAGE_MEMBERS_ROLE)
    {
        _setMemberLevel(_id, _level);
        MemberUpdated(_id);
    }
    
    /**
     * @notice Set the Account address of a Member in an organisation
     * @param _id The id of the Member
     * @param _address the new address for the member.
     */
    function setMemberAddress(uint _id, address _address)
        external
        auth(MANAGE_MEMBERS_ROLE)
    {
        _setMemberAddress(_id, _address);
        MemberUpdated(_id);
    }
    
    /**
     * @notice Set the name of a Member in an organisation
     * @param _id The id of the Member
     * @param _name The new name for the member
     */
    function setMemberName(uint _id, string _name) 
        external
        auth(MANAGE_MEMBERS_ROLE)
    {
        _setMemberName(_id, _name);
        MemberUpdated(_id);
    }
    
    function updateMember(uint _id, address _address, string _name, Level _level)
        external
        auth(MANAGE_MEMBERS_ROLE)
        isMemberById(_id)
    {
        require(isValidMember(_address, _name, _level));
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        
        if (member.accountAddress != _address) {
            _setMemberAddress(_id, _address);
        }
        if (!member.name.compareTo(_name)) {
            _setMemberName(_id, _name);
        }
        if (member.level != _level) {
            _setMemberLevel(_id, _level);
        }
        
        MemberUpdated(_id);
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
        returns (address accountAddress, string name, Level level) 
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        accountAddress = member.accountAddress;
        name = member.name;
        level = member.level;
    }
    
    function _addMember(address _address, string _name, Level _level) 
        internal
        auth(MANAGE_MEMBERS_ROLE)        
    {
        require(addressToMember[_address].accountAddress == address(0));
        require(isValidMember(_address, _name, _level));
        
        uint id = memberAddresses.push(_address) - 1;
        Member memory member = Member(_address, _name, _level);
        addressToMember[_address] = member;
        MemberAdded(id, _address, _name);
    }
    
    function _removeMember(uint _id) 
        internal
        auth(MANAGE_MEMBERS_ROLE)
        isMemberById(_id) 
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
    
    function _setMemberLevel(uint _id, Level _level) 
        internal
        isMemberById(_id)         
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.level = _level;
    }
    
    function _setMemberAddress(uint _id, address _address)
        internal
        isMemberById(_id)
    {
        require(isValidAddress(_address));
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.accountAddress = _address;
    }
    
    function _setMemberName(uint _id, string _name) 
        internal
        isMemberById(_id)
    {
        require(isValidName(_name));
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.name = _name;
    }
}