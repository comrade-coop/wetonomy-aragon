pragma solidity 0.4.18;

import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "@aragon/os/contracts/lib/zeppelin/math/SafeMath.sol";
import "./interfaces/ITokenManager.sol";


contract DaoTokenManager is ITokenManager {
    
    event DaoTokensMinted(address indexed receiver, uint amount);
    event DaoTokensBurned(address indexed owner, uint amount);
    
    MiniMeToken public daoToken;
    
    modifier onlyToken() {
        require(msg.sender == address(daoToken));
        _;
    }
    
    /// @notice Called when `_owner` sends ether to the MiniMe Token contract
    /// @return True if the ether is accepted, false if it throws
    function proxyPayment(address) 
        public
        payable
        onlyToken
        returns (bool)
    {
        return false;
    }
    
    /// @notice Notifies the controller about a token transfer allowing the
    ///  controller to react if desired
    /// @return False if the controller does not authorize the transfer
    function onTransfer(address, address, uint) 
        public 
        onlyToken         
        returns (bool)
    {
        return false;
    }

    /// @notice Notifies the controller about an approval allowing the
    ///  controller to react if desired
    /// @return False if the controller does not authorize the approval
    function onApprove(address, address, uint)
        public       
        onlyToken
        returns(bool)
    {
        return false;
    }
    
    function _mintDaoTokens(address _receiver, uint _amount) internal {
        daoToken.generateTokens(_receiver, _amount);
        DaoTokensMinted(_receiver, _amount);
    }
    
    function _burnDaoTokens(address _owner, uint _amount) internal {
        daoToken.destroyTokens(_owner, _amount);
        DaoTokensBurned(_owner, _amount);
    }
}
