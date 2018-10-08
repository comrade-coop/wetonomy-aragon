const _ = require('lodash')
const TokenRewardsManager = artifacts.require('TokenRewardsManager.sol')
const MembersMock = artifacts.require('MembersMock.sol')

const MiniMeToken = artifacts.require('MiniMeToken.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const REWARD_TO_DAO_COURSE = 2
const INFLATION_MULTIPLIER = 100
const MEMBERS_INITIAL_REPUTATION = 1

contract('TokenRewardsManager', async (accounts) => {
  let app
  let membersApp

  beforeEach(async () => {
    const rewardTokenInstance = await createToken('Reward Token', 18, 'RWD', false)
    const daoTokenInstance = await createToken('DAO Token', 18, 'DAO', false)

    membersApp = await MembersMock.new()
    app = await TokenRewardsManager.new()

    await membersApp.initialize(MEMBERS_INITIAL_REPUTATION, { from: accounts[0] })
    await app.initialize(
      membersApp.address,
      rewardTokenInstance.address,
      daoTokenInstance.address,
      REWARD_TO_DAO_COURSE,
      INFLATION_MULTIPLIER)

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

    await app.claimRewardTokens(accounts[0])

    const balance = await rewardTokenInstance.balanceOf.call(accounts[0])
    assert.equal(mintPerMember * newMemberReputation * INFLATION_MULTIPLIER,
      balance.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')

    await  app.claimRewardTokens(accounts[1])

    const balanceSecond = await rewardTokenInstance.balanceOf.call(accounts[1])
    assert.equal(mintPerMember * INFLATION_MULTIPLIER, balanceSecond.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')
  })

  it('should transfer right amount of reward tokens between two addresses', async () => {
    const mintPerMember = 10
    const rewardTokenAddress = await app.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)

    await app.mint(mintPerMember)
    await app.claimRewardTokens(accounts[0])
    await app.claimRewardTokens(accounts[1])

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

    await app.claimRewardTokens(accounts[0])

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

    await app.claimRewardTokens(accounts[0])
    await assertRevert(() => app.reward(account, account, rewardAmount))
  })

  it('shouldn\'t allow an address to claim his reward tokens more than once', async () => {
    await app.mint(10)

    await app.claimRewardTokens(accounts[0])
    await assertRevert(() => app.claimRewardTokens(accounts[0]))
  })

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