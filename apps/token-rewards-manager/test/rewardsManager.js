const RewardsManager = artifacts.require('TokenRewardsManager.sol')
const MiniMeToken = artifacts.require('MiniMeToken.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const REWARD_TO_DAO_COURSE = 2

contract('TokenRewardsManager', async (accounts) => {

  it('should initialize the app with the given Token instances and course', async () => {
    const instance = await RewardsManager.deployed()
    const instanceAddress = instance.address

    const rewardTokenInstance = await createToken('Reward Token', 18, 'RWD', false)
    const daoTokenInstance = await createToken('DAO Token', 18, 'DAO', false)

    await instance.initialize(rewardTokenInstance.address, daoTokenInstance.address, REWARD_TO_DAO_COURSE)

    const contractRewardToken = await instance.rewardToken.call()
    const contractDaoToken = await instance.daoToken.call()
    const contractCourse = await instance.rewardToDaoCourse.call()
    
    assert.equal(rewardTokenInstance.address, contractRewardToken, 'Should have initialized with right RewardToken instance')
    assert.equal(daoTokenInstance.address, contractDaoToken, 'Should have initialized with right DaoToken instance')
    assert.equal(REWARD_TO_DAO_COURSE, contractCourse, 'Should have initialized with right Reward token to DAO token course')       

    await rewardTokenInstance.changeController(instanceAddress)
    await daoTokenInstance.changeController(instanceAddress)

    assert.equal(instanceAddress, await rewardTokenInstance.controller.call(), 
      'Should have changed the controller of the Rewards token to be the TokenManager')
    assert.equal(instanceAddress, await daoTokenInstance.controller.call(), 
      'Should have changed the controller of the DAO token to be the TokenManager')
  })

  it('should mint 1000 reward tokens', async () => {
    const instance = await RewardsManager.deployed()
    const receiver = accounts[0]
    const mintAmount = 1000

    const rewardTokenAddress = await instance.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)

    await instance.mint(receiver, mintAmount)

    const balance = await rewardTokenInstance.balanceOf.call(receiver)
    assert.equal(mintAmount, balance.toNumber(), 'The account\'s balance should have increased in the Reward Token contract')
  })

  it('should reward an address and update balances correctly', async () => {
    const instance = await RewardsManager.deployed()
    const rewarder = accounts[0]
    const receiver = accounts[1]
    const rewardAmount = 100

    const rewardTokenAddress = await instance.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)
    const daoTokenAddress = await instance.daoToken.call()
    const daoTokenInstance = MiniMeToken.at(daoTokenAddress)

    const initialRewardBalanceRewarder = (await rewardTokenInstance.balanceOf.call(rewarder)).toNumber()
    const initialDaoBalanceReceiver = (await daoTokenInstance.balanceOf.call(receiver)).toNumber()

    await instance.reward(rewarder, receiver, rewardAmount)

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
    const instance = await RewardsManager.deployed()
    const account = accounts[0]
    const rewardAmount = 100    

    await assertRevert(() => instance.reward(account, account, rewardAmount))
  })  

})

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