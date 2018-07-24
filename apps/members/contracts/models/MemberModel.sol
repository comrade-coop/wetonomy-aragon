pragma solidity 0.4.18;

import "../libs/Strings.sol";


contract MemberModel {
    using Strings for string;

    uint8 public constant MIN_NAME_LENGTH = 3;
    uint8 public constant MAX_NAME_LENGTH = 30;

    enum Level { JUNIOR, INTERMEDIATE, SENIOR, EXPERT }
    
    struct Member {
        address accountAddress;
        string name;
        Level level;
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
    
    function isValidMember(address _address, string _name, Level _level)
        public
        pure
        returns (bool)
    {
        return isValidAddress(_address) && isValidName(_name);
    }
}