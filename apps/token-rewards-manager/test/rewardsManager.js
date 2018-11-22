const _ = require('lodash')
const TokenRewardsManager = artifacts.require('TokenRewardsManager.sol')
const Members = artifacts.require('Members.sol')
const Kernel = artifacts.require('Kernel')
const ACL = artifacts.require('ACL')
const DAOFactory = artifacts.require('DAOFactory')
const MiniMeToken = artifacts.require('MiniMeToken.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const REWARD_TO_DAO_COURSE = 2
const INFLATION_MULTIPLIER = 100
const MEMBERS_INITIAL_REPUTATION = 1

const MEMBERS_ID = '0x01'
const TOKEN_MANAGER_ID = '0x02'

contract('TokenRewardsManager', async (accounts) => {
  let app
  let membersApp
  const root = accounts[0]
  const NULL_ADDRESS = '0x00'

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

    const rewardTokenInstance = await createToken('Reward Token', 18, 'RWD', false)
    const daoTokenInstance = await createToken('DAO Token', 18, 'DAO', false)

    membersApp = await installApp(
      dao,
      Members,
      MEMBERS_ID,
      root,
      MEMBERS_INITIAL_REPUTATION
    )
    app = await installApp(
      dao,
      TokenRewardsManager,
      TOKEN_MANAGER_ID,
      root,
      membersApp.address,
      rewardTokenInstance.address,
      daoTokenInstance.address,
      REWARD_TO_DAO_COURSE,
      INFLATION_MULTIPLIER
    )

    await configurePermissions(
      acl,
      membersApp,
      app
    )

    const appAddress = app.address
    const contractRewardToken = await app.rewardToken.call()
    const contractDaoToken = await app.daoToken.call()
    const contractCourse = (await app.rewardToDaoCourse.call()).toNumber()
    const contractMembers = await app.members.call()

    assert.equal(membersApp.address, contractMembers, 'Should have initialized with right Members contract')
    assert.equal(rewardTokenInstance.address, contractRewardToken, 'Should have initialized with right RewardToken app')
    assert.equal(daoTokenInstance.address, contractDaoToken, 'Should have initialized with right DaoToken instance')
    assert.equal(REWARD_TO_DAO_COURSE, contractCourse, 'Should have initialized with right Reward token to DAO token course')

    await rewardTokenInstance.changeController(appAddress)
    await daoTokenInstance.changeController(appAddress)

    assert.equal(appAddress, await rewardTokenInstance.controller.call(),
      'Should have changed the controller of the Rewards token to be the TokenManager')
    assert.equal(appAddress, await daoTokenInstance.controller.call(),
      'Should have changed the controller of the DAO token to be the TokenManager')

    await addMembers(membersApp, accounts)
  })

  it('should mint right amount of reward tokens for members', async () => {
    const newMemberReputation = 8

    await membersApp.setMemberReputation(0, newMemberReputation)

    const mintPerMember = 10

    const rewardTokenAddress = await app.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)

    await app.mint(mintPerMember)

    await app.claimRewardTokensFor(accounts[0])

    const balance = await rewardTokenInstance.balanceOf.call(accounts[0])
    assert.equal(mintPerMember * newMemberReputation * INFLATION_MULTIPLIER,
      balance.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')

    await  app.claimRewardTokensFor(accounts[1])

    const balanceSecond = await rewardTokenInstance.balanceOf.call(accounts[1])
    assert.equal(mintPerMember * INFLATION_MULTIPLIER, balanceSecond.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')
  })

  it('should transfer right amount of reward tokens between two addresses', async () => {
    const mintPerMember = 10
    const rewardTokenAddress = await app.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)

    await app.mint(mintPerMember)
    await app.claimRewardTokensFor(accounts[0])
    await app.claimRewardTokensFor(accounts[1])

    const balanceFrom = (await rewardTokenInstance.balanceOf.call(accounts[0])).toNumber()
    const balanceTo = (await rewardTokenInstance.balanceOf.call(accounts[1])).toNumber()
    const transferAmount = 100

    await app.transfer(accounts[0], accounts[1], transferAmount);

    const balanceFromAfter = (await rewardTokenInstance.balanceOf.call(accounts[0])).toNumber()
    const balanceToAfter = (await rewardTokenInstance.balanceOf.call(accounts[1])).toNumber()
    assert.equal(balanceFrom - transferAmount, balanceFromAfter,
      'The account\'s balance should have decreased in the Reward Token contract')
    assert.equal(balanceTo + transferAmount, balanceToAfter,
      'The account\'s balance should have increased in the Reward Token contract')
  })

  it('should reward an address and update balances correctly', async () => {
    await app.mint(10)

    const rewarder = accounts[0]
    const receiver = accounts[1]
    const rewardAmount = 100

    const rewardTokenAddress = await app.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)
    const daoTokenAddress = await app.daoToken.call()
    const daoTokenInstance = MiniMeToken.at(daoTokenAddress)

    await app.claimRewardTokensFor(accounts[0])

    const initialRewardBalanceRewarder = (await rewardTokenInstance.balanceOf.call(rewarder)).toNumber()
    const initialDaoBalanceReceiver = (await daoTokenInstance.balanceOf.call(receiver)).toNumber()

    await app.reward(rewarder, receiver, rewardAmount)

    const rewardBalanceRewarder = (await rewardTokenInstance.balanceOf.call(rewarder)).toNumber()
    const daoBalanceReceiver = (await daoTokenInstance.balanceOf.call(receiver)).toNumber()

    assert.equal(
      initialRewardBalanceRewarder - rewardAmount,
      rewardBalanceRewarder,
      'The rewarder\'s balance should have decreased in the Reward Token contract')
    assert.equal(
      initialDaoBalanceReceiver + (rewardAmount * REWARD_TO_DAO_COURSE),
      daoBalanceReceiver,
      'The receiver\'s balance should have increased in the DAO Token contract')
  })

  it('shouldn\'t allow an address to reward itself', async () => {
    await app.mint(10)

    const account = accounts[0]
    const rewardAmount = 100

    await app.claimRewardTokensFor(accounts[0])
    await assertRevert(() => app.reward(account, account, rewardAmount))
  })

  it('shouldn\'t allow an address to claim his reward tokens more than once', async () => {
    await app.mint(10)

    await app.claimRewardTokensFor(accounts[0])
    await assertRevert(() => app.claimRewardTokensFor(accounts[0]))
  })
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
  const configurePermissions = async (
    acl,
    membersApp,
    tokenManager
  ) => {
    const MANAGE_MEMBERS_ROLE = await membersApp.MANAGE_MEMBERS_ROLE()
    const TRANSFER_ROLE = await tokenManager.TRANSFER_ROLE()
    const REWARD_ROLE = await tokenManager.REWARD_ROLE()
    const MINT_ROLE = await tokenManager.MINT_ROLE()
    await acl.createPermission(root,   membersApp.address,   MANAGE_MEMBERS_ROLE, root, { from: root })
    await acl.createPermission(root, tokenManager.address, TRANSFER_ROLE,         root, { from: root });
    await acl.createPermission(root, tokenManager.address, REWARD_ROLE,           root, { from: root });
    await acl.createPermission(root, tokenManager.address, MINT_ROLE,             root, { from: root })
    
  }
})

const addMembers = async (membersApp, accounts) => {
  await Promise.all(_.range(0, 5).map(async i =>
    await membersApp.addMember(accounts[i], 'Pesho', 2)
  ))
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