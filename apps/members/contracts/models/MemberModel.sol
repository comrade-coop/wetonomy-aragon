pragma solidity ^0.4.18;

import "../libs/Strings.sol";

contract MemberModel {
    using Strings for string;

    uint8 constant MIN_NAME_LENGTH = 3;
    uint8 constant MAX_NAME_LENGTH = 30;

    enum Level { JUNIOR, INTERMEDIATE, SENIOR, EXPERT }
    
    struct Member {
        address accountAddress;
        string name;
        Level level;
    }
    
    modifier validName(string _name) {
        uint nameLength = _name.length();
        require(
            nameLength >= MIN_NAME_LENGTH &&
            nameLength <= MAX_NAME_LENGTH
        );
        _;
    }
    
    function isValidMember(address _address, string _name) 
        validName(_name) 
        public
        pure
        returns (bool)
    {
        return _address != address(0);
    }
    
}