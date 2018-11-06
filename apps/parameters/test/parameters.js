const abi = require('web3-eth-abi')
const _ = require('lodash')
const Kernel = artifacts.require('Kernel')
const ACL = artifacts.require('ACL')
const DAOFactory = artifacts.require('DAOFactory')
const TokenRewardsManager = artifacts.require('TokenRewardsManager.sol')
const Members = artifacts.require('Members.sol')
const TimeTracking = artifacts.require('InflationTimeTracking.sol')
const Voting = artifacts.require('Voting.sol')
const Parameters = artifacts.require('Parameters.sol')

const MiniMeToken = artifacts.require('MiniMeToken.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const getBlockNumber = require('@aragon/test-helpers/blockNumber')(web3)
const { encodeCallScript } = require('@aragon/test-helpers/evmScript')

const DEFAULT_MEMBERS_INITIAL_REPUTATION = 1
const DEFAULT_REWARD_TO_DAO_COURSE = 2
const DEFAULT_INFLATION_MULTIPLIER = 100
const DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS = 30 * 60 * 60 * 24
const DEFAULT_MAX_HOURS_PER_PERIOD = 160

const NEW_MEMBER_REPUTATION = 8
const MINT_PER_MEMBER = 10

const MEMBERS_ID = '0x01'
const TOKEN_MANAGER_ID = '0x02'
const VOTING_ID = '0x03'
const TIME_TRACKING_ID = '0x04'
const PARAMETERS_ID = '0x05'

const EVM_SCRIPT_INDEX_VOTING_APP = 9

const pct16 = x =>
  new web3.BigNumber(x).times(new web3.BigNumber(10).toPower(16))

contract('Parameters', async accounts => {
  let daoFactory, counterBase, parametersInstance

  const root = accounts[0]
  const NULL_ADDRESS = '0x00'
  let APP_MANAGER_ROLE, CHANGE_PARAMETERS_ROLE

  const votingTime = 1000
  const neededSupport = pct16(50)
  const minimumAcceptanceQuorum = pct16(20)

  let votingApp
  let membersApp
  let tokenManagerApp
  let timeTrackingApp

  before(async () => {
    const kernelBase = await Kernel.new(true) // petrify immediately
    const aclBase = await ACL.new()
    daoFactory = await DAOFactory.new(
      kernelBase.address,
      aclBase.address,
      NULL_ADDRESS
    )

    // Setup constants
    APP_MANAGER_ROLE = await kernelBase.APP_MANAGER_ROLE()
  })

  beforeEach(async () => {
    const daoTx = await daoFactory.newDAO(root)
    const dao = Kernel.at(
      daoTx.logs.filter(log => log.event == 'DeployDAO')[0].args.dao
    )
    const acl = ACL.at(await dao.acl())

    await acl.createPermission(root, dao.address, APP_MANAGER_ROLE, root, {
      from: root
    })

    const rewardTokenInstance = await createToken(
      'Reward Token',
      18,
      'RWD',
      true
    )
    const daoTokenInstance = await createToken('DAO Token', 18, 'DAO', true)

    membersApp = await installApp(
      dao,
      Members,
      MEMBERS_ID,
      root,
      DEFAULT_MEMBERS_INITIAL_REPUTATION
    )
    tokenManagerApp = await installApp(
      dao,
      TokenRewardsManager,
      TOKEN_MANAGER_ID,
      root,
      membersApp.address,
      rewardTokenInstance.address,
      daoTokenInstance.address,
      DEFAULT_REWARD_TO_DAO_COURSE,
      DEFAULT_INFLATION_MULTIPLIER
    )

    timeTrackingApp = await installApp(
      dao,
      TimeTracking,
      TIME_TRACKING_ID,
      root,
      membersApp.address,
      DEFAULT_TIME_TRACKING_PERIOD_LENGTH_SECONDS,
      DEFAULT_MAX_HOURS_PER_PERIOD
    )
    votingApp = await installApp(
      dao,
      Voting,
      VOTING_ID,
      root,
      daoTokenInstance.address,
      neededSupport,
      minimumAcceptanceQuorum,
      votingTime
    )
    parametersInstance = await installApp(
      dao,
      Parameters,
      PARAMETERS_ID,
      root,
      votingApp.address,
      membersApp.address,
      timeTrackingApp.address,
      tokenManagerApp.address
    )

    await configurePermissions(
      acl,
      membersApp,
      tokenManagerApp,
      timeTrackingApp,
      votingApp,
      parametersInstance
    )

    const contractVoting = await parametersInstance.votingApp.call()
    const contractMembers = await parametersInstance.members.call()
    const contractTimeTracking = await parametersInstance.timeTracking.call()
    const contractTokenManager = await parametersInstance.tokenManager.call()

    assert.equal(
      votingApp.address,
      contractVoting,
      'Should have initialized with right Voting contract'
    )
    assert.equal(
      membersApp.address,
      contractMembers,
      'Should have initialized with right Members contract'
    )
    assert.equal(
      timeTrackingApp.address,
      contractTimeTracking,
      'Should have initialized with right Token Manager app'
    )
    assert.equal(
      tokenManagerApp.address,
      contractTokenManager,
      'Should have initialized with right TimeTracking app'
    )

    await rewardTokenInstance.changeController(tokenManagerApp.address)
    await daoTokenInstance.changeController(tokenManagerApp.address)

    assert.equal(
      tokenManagerApp.address,
      await rewardTokenInstance.controller.call(),
      'Should have changed the controller of the Rewards token to be the TokenManager'
    )
    assert.equal(
      tokenManagerApp.address,
      await daoTokenInstance.controller.call(),
      'Should have changed the controller of the DAO token to be the TokenManager'
    )

    await addMembers(membersApp, accounts)
    await membersApp.setMemberReputation(0, NEW_MEMBER_REPUTATION)
    await tokenManagerApp.mint(MINT_PER_MEMBER)
    await tokenManagerApp.claimRewardTokens(accounts[0])

    const balance = await rewardTokenInstance.balanceOf.call(accounts[0])
    assert.equal(
      MINT_PER_MEMBER * NEW_MEMBER_REPUTATION * DEFAULT_INFLATION_MULTIPLIER,
      balance.toNumber(),
      "The account's balance should have increased in the Reward Token contract"
    )

    await tokenManagerApp.claimRewardTokens(accounts[1])

    const balanceSecond = await rewardTokenInstance.balanceOf.call(accounts[1])
    assert.equal(
      MINT_PER_MEMBER * DEFAULT_INFLATION_MULTIPLIER,
      balanceSecond.toNumber(),
      "The account's balance should have increased in the Reward Token contract"
    )
    //create dao tokens
    await tokenManagerApp.reward(accounts[0], accounts[1], 100)
    const daoBalance = await daoTokenInstance.balanceOf.call(accounts[1])
    assert.equal(
      100 * DEFAULT_REWARD_TO_DAO_COURSE,
      daoBalance.toNumber(),
      "The account's balance should have increased in the Dao Token contract"
    )
  })

  it('should issue voting for initial members reputation', async () => {
    const action = {
      to: membersApp.address,
      calldata: membersApp.contract.setInitialReputation.getData(7)
    }
    const script = encodeCallScript([action])
    const tx = await parametersInstance.changeParameter(
      script,
      'Change Initial Member Reputation With 7'
    )

    await votingApp.vote(0, true, false, { from: accounts[1] })
    const vote = await votingApp.getVote(0)
    const voteScript = vote[EVM_SCRIPT_INDEX_VOTING_APP]

    assert.equal(script, voteScript, 'Vote script not equal')
  })

  it('should issue voting for timetracking period lenght', async () => {
    const action = {
      to: timeTrackingApp.address,
      calldata: timeTrackingApp.contract.changePeriodLength.getData(
        40 * 60 * 60 * 24
      )
    }
    // console.log(action)
    const script = encodeCallScript([action])
    await parametersInstance.changeParameter(
      script,
      'Change TimeTracking period lenght to 40 days'
    )
    await validateVotingScript(script)
  })

  it('should issue voting for max hours per period', async () => {
    const action = {
      to: timeTrackingApp.address,
      calldata: timeTrackingApp.contract.changeMaxHoursPerPeriod.getData(140)
    }
    // console.log(action)
    const script = encodeCallScript([action])
    await parametersInstance.changeParameter(
      script,
      'Change TimeTracking max hours per period to 140h'
    )
    await validateVotingScript(script)
  })

  it('should issue voting for inflation multiplier', async () => {
    const action = {
      to: tokenManagerApp.address,
      calldata: tokenManagerApp.contract.changeInflationMultiplier.getData(50)
    }
    // console.log(action)
    const script = encodeCallScript([action])
    await parametersInstance.changeParameter(
      script,
      'Change TokenManager inflation multiplier to x50'
    )
    await validateVotingScript(script)
  })

  it('should issue voting for reward to dao course', async () => {
    const action = {
      to: tokenManagerApp.address,
      calldata: tokenManagerApp.contract.changeRewardToDaoCourse.getData(3)
    }
    // console.log(action)
    const script = encodeCallScript([action])
    await parametersInstance.changeParameter(
      script,
      'Change TokenManager reward to dao course to x3'
    )
    await validateVotingScript(script)
  })

  const validateVotingScript = async script => {
    await votingApp.vote(0, true, false, { from: accounts[1] })
    const vote = await votingApp.getVote(0)
    const voteScript = vote[EVM_SCRIPT_INDEX_VOTING_APP]

    assert.equal(script, voteScript, 'Vote script not equal')
  }

  const configurePermissions = async (
    acl,
    membersApp,
    tokenManagerApp,
    timeTrackingApp,
    votingApp,
    parametersApp
  ) => {
    const MANAGE_MEMBERS_ROLE = await membersApp.MANAGE_MEMBERS_ROLE()
    await acl.createPermission(
      root,
      membersApp.address,
      MANAGE_MEMBERS_ROLE,
      root,
      { from: root }
    )
    await acl.grantPermission(
      votingApp.address,
      membersApp.address,
      MANAGE_MEMBERS_ROLE,
      { from: root }
    )

    const MANAGE_TRACKING_ROLE = await timeTrackingApp.MANAGE_TRACKING_ROLE()
    await acl.createPermission(
      parametersApp.address,
      timeTrackingApp.address,
      MANAGE_TRACKING_ROLE,
      root,
      { from: root }
    )

    const CREATE_VOTES_ROLE = await votingApp.CREATE_VOTES_ROLE()
    const ANY_ENTITY = await acl.ANY_ENTITY()
    await acl.createPermission(
      ANY_ENTITY,
      votingApp.address,
      CREATE_VOTES_ROLE,
      root,
      { from: root }
    )

    const MANAGE_TOKEN_MANAGER_ROLE = await tokenManagerApp.MANAGE_TOKEN_MANAGER_ROLE()
    const MINT_ROLE = await tokenManagerApp.MINT_ROLE()
    const REWARD_ROLE = await tokenManagerApp.REWARD_ROLE()
    await acl.createPermission(
      parametersApp.address,
      tokenManagerApp.address,
      MANAGE_TOKEN_MANAGER_ROLE,
      root,
      { from: root }
    )
    await acl.createPermission(
      root,
      tokenManagerApp.address,
      REWARD_ROLE,
      root,
      { from: root }
    )
    await acl.createPermission(root, tokenManagerApp.address, MINT_ROLE, root, {
      from: root
    })
  }
})

const addMembers = async (membersApp, accounts) => {
  await Promise.all(
    _.range(0, 5).map(
      async i => await membersApp.addMember(accounts[i], 'Pesho', 2)
    )
  )
}
const account = any => {
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

const installApp = async (dao, contractClass, appId, root, ...initArgs) => {
  const baseContract = await contractClass.new()

  const receipt = await dao.newAppInstance(
    appId,
    baseContract.address,
    '0x',
    false,
    {
      from: root
    }
  )
  const proxyAddress = receipt.logs.filter(log => log.event == 'NewAppProxy')[0]
    .args.proxy

  const appInstance = contractClass.at(proxyAddress)
  appInstance.initialize(...initArgs, { from: root })

  return appInstance
}
