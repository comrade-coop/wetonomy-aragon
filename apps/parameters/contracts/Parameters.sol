pragma solidity 0.4.18;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "@aragon/apps-voting/contracts/Voting.sol";
import "@aragon/os/contracts/lib/minime/MiniMeToken.sol";
import "../../members/contracts/Members.sol";
import "../../timetracking/contracts/InflationTimeTracking.sol";
import "../../token-rewards-manager/contracts/TokenRewardsManager.sol";


contract Parameters is  AragonApp {

    Voting public votingApp;
    Members public members;
    TimeTracking public timeTracking;
    TokenRewardsManager public tokenManager;
    
    event NewVotingCreated(uint  voteId);

    bytes32 constant public CHANGE_PARAMETERS_ROLE = keccak256("CHANGE_PARAMETERS_ROLE");

    function changeParameter(bytes _executionScript, string _metadata) external {
        uint id = votingApp.newVote(_executionScript, _metadata);
        NewVotingCreated(id);
    }

    function setVotingApp(Voting _voting) external {
        votingApp = _voting;
    }

    function initialize(Voting _voting, Members _members, TimeTracking _timeTracking, TokenRewardsManager _tokenManager)
        external onlyInit 
    {
        votingApp = _voting;
        members = _members;
        timeTracking = _timeTracking;
        tokenManager = _tokenManager;
        initialized();
    }
    
    function getMemberesParameters() external view returns(uint) {
        return members.initialReputation();
    }

    function getTokenManagerParameters() external view returns(uint, uint) {
        return (tokenManager.inflationMultiplier(), tokenManager.rewardToDaoCourse() );
    }

    function getTokenTimeTrackingParameters() external view returns(uint, uint) {
        return (timeTracking.periodLength(), timeTracking.maxHoursPerPeriod() );
    }

    // Dao Tokens
    function getDaoCreationBlockNumber() external view returns(uint) { 
        MiniMeToken token = tokenManager.daoToken();
        return token.creationBlock();
    }

    function getDaoTokensAtBlock(uint number) external view returns(uint) {
        MiniMeToken token = tokenManager.daoToken();
        return (token.totalSupplyAt(number));
    }

    //RewardTokens
    function getRewardCreationBlockNumber() external view returns(uint) { 
        MiniMeToken token = tokenManager.rewardToken();
        return token.creationBlock();
    }

    function getRewardTokensAtBlock(uint number) external view returns(uint) {
        MiniMeToken token = tokenManager.rewardToken();
        return (token.totalSupplyAt(number));
    }

    function getUserBalance(address from) external view returns (uint, uint) {
        return tokenManager.getUserBalance(from);
    }
}