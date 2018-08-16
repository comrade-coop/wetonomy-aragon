pragma solidity 0.4.18;

import "../libs/Strings.sol";


contract MemberModel {
    using Strings for string;

    uint8 public constant MIN_NAME_LENGTH = 3;
    uint8 public constant MAX_NAME_LENGTH = 30;

    enum Level { NONE, JUNIOR, INTERMEDIATE, SENIOR, EXPERT }
    
    struct Member {
        string name;
        Level level;
        uint reputation;
    }
    
    function isValidName(string _name) 
        public 
        pure
        returns(bool)
    {
        uint nameLength = _name.length();
        return nameLength >= MIN_NAME_LENGTH && nameLength <= MAX_NAME_LENGTH;
    }
    
    function isValidAddress(address _address) 
        public 
        pure
        returns(bool)
    {
        return _address != address(0);
    }
    
    function isValidMember(address _address, string _name, Level)
        public
        pure
        returns (bool)
    {
        return isValidAddress(_address) && isValidName(_name);
    }
    
    function _createMember(address _accountAddress, string _name, Level _level, uint _reputation)
        internal
        pure
        returns(Member)
    {
        require(isValidMember(_accountAddress, _name, _level));
        return Member(_name, _level, _reputation);
    }
}