const abi = require('web3-eth-abi')
const _ = require('lodash')
const TokenRewardsManagerMock = artifacts.require('TokenRewardsManagerMock.sol')
const MembersMock = artifacts.require('MembersMock.sol')
const TimeTrackingMock = artifacts.require('InflationTimeTracking.sol')
const Voting = artifacts.require('Voting.sol')
const Parameters = artifacts.require('Parameters.sol')

const MiniMeToken = artifacts.require('MiniMeToken.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const getBlockNumber = require('@aragon/test-helpers/blockNumber')(web3)
const { encodeCallScript } = require('@aragon/test-helpers/evmScript')

const DEFAULT_MEMBERS_INITIAL_REPUTATION = 1
const DEFAULT_REWARD_TO_DAO_COURSE = 2;
const DEFAULT_INFLATION_MULTIPLIER = 100;
const DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS = 30 * 60 * 60 * 24;
const DEFAULT_MAX_HOURS_PER_PERIOD = 160;


const NEW_MEMBER_REPUTATION = 8
const MINT_PER_MEMBER = 10

const pct16 = x => new web3.BigNumber(x).times(new web3.BigNumber(10).toPower(16))

contract('Parameters', async (accounts) => {
  let app
  let votingApp
  let membersApp
  let tokenManagerApp
  let timeTrackingApp

  beforeEach(async () => {
    const rewardTokenInstance = await createToken('Reward Token', 18, 'RWD', true)
    const daoTokenInstance = await createToken('DAO Token', 18, 'DAO', true)

    votingApp = await Voting.new()
    membersApp = await MembersMock.new()
    tokenManagerApp = await TokenRewardsManagerMock.new()
    timeTrackingApp = await TimeTrackingMock.new()
    app = await Parameters.new()

    await membersApp.initialize(DEFAULT_MEMBERS_INITIAL_REPUTATION, { from: accounts[0] })
    const votingTime = 1000
    const neededSupport = pct16(50)
    const minimumAcceptanceQuorum = pct16(20)

    await votingApp.initialize(
      daoTokenInstance.address,
      neededSupport,
      minimumAcceptanceQuorum,
      votingTime
    )

    await tokenManagerApp.initialize(
      membersApp.address,
      rewardTokenInstance.address,
      daoTokenInstance.address,
      DEFAULT_REWARD_TO_DAO_COURSE,
      DEFAULT_INFLATION_MULTIPLIER)
    
    await timeTrackingApp.initialize(
      // tokenManagerApp.address,
      membersApp.address,
      DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS,
      DEFAULT_MAX_HOURS_PER_PERIOD)

    await app.initialize(
      votingApp.address,
      membersApp.address,
      timeTrackingApp.address,
      tokenManagerApp.address)

    const tokenManager = tokenManagerApp.address
    const contractVoting = await app.votingApp.call()
    const contractMembers = await app.members.call()
    const contractTokenManager = await app.tokenManager.call()
    const contractTimeTracking = await app.timeTracking.call()

    assert.equal(votingApp.address, contractVoting, 'Should have initialized with right Voting contract')
    assert.equal(membersApp.address, contractMembers, 'Should have initialized with right Members contract')
    assert.equal(timeTrackingApp.address, contractTimeTracking, 'Should have initialized with right Token Manager app')
    assert.equal(tokenManagerApp.address, contractTokenManager, 'Should have initialized with right TimeTracking app')

    await rewardTokenInstance.changeController(tokenManager)
    await daoTokenInstance.changeController(tokenManager)

    assert.equal(tokenManager, await rewardTokenInstance.controller.call(),
      'Should have changed the controller of the Rewards token to be the TokenManager')
    assert.equal(tokenManager, await daoTokenInstance.controller.call(),
      'Should have changed the controller of the DAO token to be the TokenManager')

    await addMembers(membersApp, accounts)
    await membersApp.setMemberReputation(0, NEW_MEMBER_REPUTATION)
    await tokenManagerApp.mint(MINT_PER_MEMBER)
    await tokenManagerApp.claimRewardTokens(accounts[0])

    const balance = await rewardTokenInstance.balanceOf.call(accounts[0])
    assert.equal(MINT_PER_MEMBER * NEW_MEMBER_REPUTATION * DEFAULT_INFLATION_MULTIPLIER,
      balance.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')

    await tokenManagerApp.claimRewardTokens(accounts[1])

    const balanceSecond = await rewardTokenInstance.balanceOf.call(accounts[1])
    assert.equal(MINT_PER_MEMBER * DEFAULT_INFLATION_MULTIPLIER, balanceSecond.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')
      //create dao tokens
    await tokenManagerApp.reward(accounts[0],accounts[1], 100)
    const daoBalance = await daoTokenInstance.balanceOf.call(accounts[1])
    assert.equal(100 * DEFAULT_REWARD_TO_DAO_COURSE, daoBalance.toNumber(),
      'The account\'s balance should have increased in the Dao Token contract')
  })

  it('should issue voting for initial members reputation', async () => {

    const action = { to: membersApp.address, calldata: membersApp.contract.setInitialReputation.getData(7) }
    // console.log(action)
    const script = encodeCallScript([action])
    await app.changeParameter(script, 'Change Initial Member Reputation With 7')
    await votingApp.vote(1, true, false, { from: accounts[1] })
    let vote = await votingApp.getVoteMetadata(1)

    assert.equal(vote, 'Change Initial Member Reputation With 7',
      'Vote metadata not equal')

    vote = await votingApp.getVote(1)

    assert.equal(vote[9], script,
      'Vote script not equal')

  })

  it('should issue voting for timetracking period lenght', async () => {

    const action = { to: timeTrackingApp.address, calldata: timeTrackingApp.contract.changePeriodLength.getData(40 *60 * 60 * 24) }
    // console.log(action)
    const script = encodeCallScript([action])
    await app.changeParameter(script, 'Change TimeTracking period lenght to 40 days')
    await votingApp.vote(1, true, false, { from: accounts[1] })
    let vote = await votingApp.getVoteMetadata(1)

    assert.equal(vote, 'Change TimeTracking period lenght to 40 days',
      'Vote metadata not equal')

    vote = await votingApp.getVote(1)

    assert.equal(vote[9], script,
      'Vote script not equal')

  })

  it('should issue voting for max hours per period', async () => {

    const action = { to: timeTrackingApp.address, calldata: timeTrackingApp.contract.changeMaxHoursPerPeriod.getData(140) }
    // console.log(action)
    const script = encodeCallScript([action])
    await app.changeParameter(script, 'Change TimeTracking max hours per period to 140h')
    await votingApp.vote(1, true, false, { from: accounts[1] })
    let vote = await votingApp.getVoteMetadata(1)

    assert.equal(vote, 'Change TimeTracking max hours per period to 140h',
      'Vote metadata not equal')

    vote = await votingApp.getVote(1)

    assert.equal(vote[9], script,
      'Vote script not equal')

  })
  
  it('should issue voting for inflation multiplier', async () => {

    const action = { to: tokenManagerApp.address, calldata: tokenManagerApp.contract.changeInflationMultiplier.getData(50) }
    // console.log(action)
    const script = encodeCallScript([action])
    await app.changeParameter(script, 'Change TokenManager inflation multiplier to x50')
    await votingApp.vote(1, true, false, { from: accounts[1] })
    let vote = await votingApp.getVoteMetadata(1)

    assert.equal(vote, 'Change TokenManager inflation multiplier to x50',
      'Vote metadata not equal')

    vote = await votingApp.getVote(1)

    assert.equal(vote[9], script,
      'Vote script not equal')

  })

  it('should issue voting for reward to dao course', async () => {

    const action = { to: tokenManagerApp.address, calldata: tokenManagerApp.contract.changeRewardToDaoCourse.getData(3) }
    // console.log(action)
    const script = encodeCallScript([action])
    await app.changeParameter(script, 'Change TokenManager reward to dao course to x3')
    await votingApp.vote(1, true, false, { from: accounts[1] })
    let vote = await votingApp.getVoteMetadata(1)

    assert.equal(vote, 'Change TokenManager reward to dao course to x3',
      'Vote metadata not equal')

    vote = await votingApp.getVote(1)

    assert.equal(vote[9], script,
      'Vote script not equal')

  })

})

const addMembers = async (membersApp, accounts) => {
  await Promise.all(_.range(0, 5).map(async i =>
    await membersApp.addMember(accounts[i], 'Pesho', 2)
  ))
}
const account = (any) => {
  return '0x0000000000000000000000000000000000000000'
}

const createToken = async (name, decimalUnits, symbol, transfersEnabled) => {
  const token = await MiniMeToken.new(
    '0x0000000000000000000000000000000000000000',
    '0x0000000000000000000000000000000000000000',
    0,
    name,
    decimalUnits,
    symbol,
    transfersEnabled
  )

  return token
}