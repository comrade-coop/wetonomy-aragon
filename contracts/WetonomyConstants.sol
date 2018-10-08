pragma solidity 0.4.18;

import "@aragon/os/contracts/apm/APMNamehash.sol";


contract WetonomyConstants is APMNamehash {
    uint constant public PCT = 10 ** 16;
    address constant public ANY_ENTITY = address(-1);

    uint constant public DEFAULT_REWARD_TO_DAO_COURSE = 2;
    uint constant public DEFAULT_INFLATION_MULTIPLIER = 100;
    uint constant public DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS = 30 * 60 * 60 * 24;
    uint constant public DEFAULT_MAX_HOURS_PER_PERIOD = 160;

    bytes32 public tokenManagerId = apmNamehash("token-rewards-manager");
    bytes32 public membersId = apmNamehash("members");
    bytes32 public timetrackingId = apmNamehash("timetracking");
    bytes32 public votingId = apmNamehash("voting");
    bytes32 public taskBoardId = apmNamehash("taskboard");
}