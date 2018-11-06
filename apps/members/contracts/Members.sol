pragma solidity 0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./interfaces/IMembers.sol";


contract Members is IMembers, AragonApp {
    
    event MemberAdded(uint indexed id, address indexed accountAddress, string name);
    event MemberUpdated(uint indexed id);
    event MemberRemoved(address indexed accountAddress, string name);    
    
    uint constant public DEFAULT_INITIAL_REPUTATION = 1;
    bytes32 constant public MANAGE_MEMBERS_ROLE = keccak256("MANAGE_MEMBERS_ROLE");
    
    uint public initialReputation = DEFAULT_INITIAL_REPUTATION;
    
    mapping(address => Member) internal addressToMember;
    address[] public memberAddresses;
    
    function initialize(uint _initialReputation) external onlyInit {
        initialReputation = _initialReputation;
        initialized();
    }
    
    /**
     * @notice Sets the initial reputation for a newly added member
     * @param _initialReputation The new initial repuation
     */
    function setInitialReputation(uint _initialReputation) 
        external
        auth(MANAGE_MEMBERS_ROLE)
    {
        initialReputation = _initialReputation;
    }
    
    /**
     * @notice Add a new Member to the organisation     
     * @param _address Address of the member
     * @param _name Name of the member
     * @param _level Experience level for the member. Must be a value between 0 and 3
     */
    function addMember(address _address, string _name, Level _level) 
        external 
        auth(MANAGE_MEMBERS_ROLE)     
    {
        _addMember(_address, _name, _level);
    }
    
    /**
     * @notice Remove a member from the organisation
     * @param _id The id of the Member     
     */
    function removeMember(uint _id) external auth(MANAGE_MEMBERS_ROLE) {
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
        emit MemberUpdated(_id);
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
        emit MemberUpdated(_id);
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
        emit MemberUpdated(_id);
    }
    
    /**
     * @notice Set the reputation of a Member in an organisation
     * @param _id The id of the Member
     * @param _reputation The new reputation for the member
     */
    function setMemberReputation(uint _id, uint _reputation) 
        external
        auth(MANAGE_MEMBERS_ROLE)
    {
        _setMemberReputation(_id, _reputation);
        emit MemberUpdated(_id);
    }
    
    function updateMember(uint _id, address _address, string _name, Level _level)
        external
        auth(MANAGE_MEMBERS_ROLE)
    {
        require(isValidMember(_address, _name, _level));
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        
        if (addressToMember[_address].level == Level.NONE) _setMemberAddress(_id, _address);        
        if (!member.name.compareTo(_name)) _setMemberName(_id, _name);
        if (member.level != _level) _setMemberLevel(_id, _level);
        
        emit MemberUpdated(_id);
    }
    
    function getMembersCount() external view returns (uint) {
        return memberAddresses.length;
    }
    
    function getMemberByAddress(address _address) 
        public 
        view
        returns (address accountAddress, string name, Level level, uint reputation) 
    {
        Member storage member = addressToMember[_address];
        require(member.level != Level.NONE);
        accountAddress = _address;
        name = member.name;
        level = member.level;
        reputation = member.reputation;
    }
    
    function getMember(uint _id)
        public
        view
        returns (address accountAddress, string name, Level level, uint reputation)
    {
        address memberAddress = memberAddresses[_id];
        return getMemberByAddress(memberAddress);
    }
        
    function _addMember(address _address, string _name, Level _level) 
        internal
    {
        require(addressToMember[_address].level == Level.NONE && _level != Level.NONE);
        Member memory member = _createMember(_address, _name, _level, initialReputation);
        
        uint id = memberAddresses.push(_address) - 1;
        
        addressToMember[_address] = member;
        emit MemberAdded(id, _address, _name);
    }
    
    function _removeMember(uint _id) 
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
        
        emit MemberRemoved(memberAddress, member.name);
    }
    
    function _setMemberLevel(uint _id, Level _level) 
        internal
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.level = _level;
    }
    
    function _setMemberAddress(uint _id, address _address)
        internal
    {
        require(isValidAddress(_address));
        require(addressToMember[_address].level == Level.NONE);
        
        address memberAddress = memberAddresses[_id];
        Member memory member = addressToMember[memberAddress];
        delete addressToMember[memberAddress];
        addressToMember[_address] = member;
        memberAddresses[_id] = _address;
    }
    
    function _setMemberName(uint _id, string _name) 
        internal
    {
        require(isValidName(_name));
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.name = _name;
    }
    
    function _setMemberReputation(uint _id, uint _reputation) 
        internal
    {
        address memberAddress = memberAddresses[_id];
        Member storage member = addressToMember[memberAddress];
        member.reputation = _reputation;
    }
}