pragma solidity 0.4.18;


contract WetonomyConstants {
    uint constant public PCT = 10 ** 16;
    address constant public ANY_ENTITY = address(-1);

    uint constant public DEFAULT_REWARD_TO_DAO_COURSE = 2;
    uint constant public DEFAULT_INFLATION_MULTIPLIER = 100;
    uint constant public DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS = 30 * 60 * 60 * 24;
    uint constant public DEFAULT_MAX_HOURS_PER_PERIOD = 160;
}