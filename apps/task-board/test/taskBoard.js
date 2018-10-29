const _ = require('lodash')

const TokenRewardsManagerMock = artifacts.require('TokenRewardsManagerMock.sol')
const MembersMock = artifacts.require('MembersMock.sol')
const TaskBoard = artifacts.require('TaskBoard.sol')

const MiniMeToken = artifacts.require('MiniMeToken.sol')
const { assertRevert } = require('@aragon/test-helpers/assertThrow')

const REWARD_TO_DAO_COURSE = 2
const INFLATION_MULTIPLIER = 100
const MEMBERS_INITIAL_REPUTATION = 1



const NEW_MEMBER_REPUTATION = 8
const MINT_PER_MEMBER = 10

contract('Task Board', async (accounts) => {
  let app
  let membersApp
  let tokenManagerApp
  let single = 0

  beforeEach(async () => {
    const rewardTokenInstance = await createToken('Reward Token', 18, 'RWD', false)
    const daoTokenInstance = await createToken('DAO Token', 18, 'DAO', false)

    membersApp = await MembersMock.new()
    tokenManagerApp = await TokenRewardsManagerMock.new()
    app = await TaskBoard.new()

    await membersApp.initialize(MEMBERS_INITIAL_REPUTATION, { from: accounts[0] })

    await tokenManagerApp.initialize(
      membersApp.address,
      rewardTokenInstance.address,
      daoTokenInstance.address,
      REWARD_TO_DAO_COURSE,
      INFLATION_MULTIPLIER)

    await app.initialize(
      membersApp.address,
      membersApp.address,
      tokenManagerApp.address)

    const tokenManager = tokenManagerApp.address
    const contractMembers = await app.members.call()
    const contractTokenManager = await app.tokenManager.call()

    assert.equal(membersApp.address, contractMembers, 'Should have initialized with right Members contract')
    assert.equal(contractTokenManager, tokenManager, 'Should have initialized with right Token Manager app')

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
    assert.equal(MINT_PER_MEMBER * NEW_MEMBER_REPUTATION * INFLATION_MULTIPLIER,
      balance.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')

    await  tokenManagerApp.claimRewardTokens(accounts[1])

    const balanceSecond = await rewardTokenInstance.balanceOf.call(accounts[1])
    assert.equal(MINT_PER_MEMBER * INFLATION_MULTIPLIER, balanceSecond.toNumber(),
      'The account\'s balance should have increased in the Reward Token contract')
  })

  it('should issue a task', async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40

    const check1 = await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    // const check2 = await app.issueMultipleTasks(accounts[0], [digest], [hashFunction], [size], [reward], [accounts[0]])

    const rewardTokenAddress = await tokenManagerApp.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)
    const contractBalance = await rewardTokenInstance.balanceOf.call(app.address)
    assert.equal(reward, contractBalance.toNumber(),
      'The contract\'s balance should have increased in the Reward Token contract')

    var task = await app.getTask(0)
    var check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
       accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')

    const check2 = await app.issueMultipleTasks(accounts[0], [digest, digest, digest], [hashFunction, hashFunction, hashFunction], [size, size, size], [reward, reward, reward], [accounts[0], accounts[0], accounts[0]])
    task = await app.getTask(1)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')
    task = await app.getTask(2)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')
    task = await app.getTask(3)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')

    // sync here
    const check3 = await app.sync([accounts[0], accounts[0], "0x0",accounts[0], "0x0",accounts[0], "0x0"],
      [3, reward, reward, reward, 0, 0, 0, 0],
      [hashFunction, size, hashFunction, size, hashFunction, size] , [digest, digest, digest])
    task = await app.getTask(4)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')
    task = await app.getTask(5)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')
    task = await app.getTask(6)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, digest, hashFunction, size, account(0))
    assert.equal(true , check, 'The task should have been issued')
    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)

  })

  it('should contribute to task', async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40,
          contribution = 40

    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    const check1 = await app.singleContribute(0, contribution)
    var task = await app.getTask(0)
    assert.equal(task[1].c[0], reward + contribution, 'The contribution should have been added')

    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    const check2 = await app.multipleContribute([1,2],[40,40])
    task = await app.getTask(1)
    assert.equal(task[1].c[0], reward + contribution, 'The contribution should have been added')
    task = await app.getTask(1)
    assert.equal(task[1].c[0], reward + contribution, 'The contribution should have been added')
    await app.sync(["0xb4124ceb3451635dacedd11767f004d8a28c6ee7"], [0, 0, 0, 3, 2, reward, 1, reward, 0, reward, 0], [], [])
    task = await app.getTask(0)
    assert.equal(task[1].c[0], reward*2 + contribution, 'The contribution should have been added')
    task = await app.getTask(1)
    assert.equal(task[1].c[0], reward*2 + contribution, 'The contribution should have been added')
    task = await app.getTask(2)
    assert.equal(task[1].c[0], reward*2 + contribution, 'The contribution should have been added')

    //sync
    const check3 = await app.sync([accounts[0]],  [0, 0, 0, 2, 1, reward, 0, reward, 0], [], [])
    task = await app.getTask(0)
    assert.equal(task[1].c[0], reward*3 + contribution, 'The contribution should have been added')
    task = await app.getTask(1)
    assert.equal(task[1].c[0], reward*3 + contribution, 'The contribution should have been added')
    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)
  })

  it('should accept task', async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40

    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    const check1 = await app.assignTask(0, accounts[1])
    var task = await app.getTask(0)
    assert.equal(task[6], accounts[1], 'ThetTask should have had assignee')
    assert.equal(task[2].c[0], 1, 'The task should have been mooved in stage assigned')

    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    const check2 = await app.assignMultipleTasks([1,2], [accounts[1],accounts[1]])

    task = await app.getTask(1)
    assert.equal(task[6], accounts[1], 'ThetTask should have had assignee')
    assert.equal(task[2].c[0], 1, 'The task should have been mooved in stage assigned')
    task = await app.getTask(2)
    assert.equal(task[6], accounts[1], 'ThetTask should have had assignee')
    assert.equal(task[2].c[0], 1, 'The task should have been mooved in stage assigned')
    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    //sync
    const check3 = await app.sync([accounts[0]],  [0, 0, 0, 0, 2, 4, 3], [1, 1], [])
    task = await app.getTask(3)
    assert.equal(task[6], accounts[0], 'ThetTask should have had assignee')
    assert.equal(task[2].c[0], 1, 'The task should have been mooved in stage assigned')
    task = await app.getTask(4)
    assert.equal(task[6], accounts[0], 'ThetTask should have had assignee')
    assert.equal(task[2].c[0], 1, 'The task should have been mooved in stage assigned')

    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)
  })

  it('should change task\'s stage' , async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40,
          stage = 3

    await app.issueMultipleTasks(accounts[0], [digest, digest, digest], [hashFunction, hashFunction, hashFunction], [size, size, size], [reward, reward, reward], [accounts[0], accounts[0], accounts[0]])
    await app.assignMultipleTasks([0,1,2], [accounts[1],accounts[1],accounts[1]])
    const check1 = await app.changeSingleState(0, stage)
    var task = await app.getTask(0)
    assert.equal(task[2].c[0], stage, 'The task\'s stage should have been changed')
    const check2 = await app.changeMultipleState([1,2], [2,2])
    task = await app.getTask(1)
    assert.equal(task[2].c[0], 2, 'The task\'s stage should have been changed')
    task = await app.getTask(2)
    assert.equal(task[2].c[0], 2, 'The task\'s stage should have been changed')

    //sync
    const check3 = await app.sync(["0xb4124ceb3451635dacedd11767f004d8a28c6ee7"], [0, 0, 0, 0, 2, 1, 0], [stage, stage], [])

    task = await app.getTask(1)
    assert.equal(task[2].c[0], stage, 'The task\'s stage should have been changed')
    task = await app.getTask(0)
    assert.equal(task[2].c[0], stage, 'The task\'s stage should have been changed')
    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)
  })
  it('should change task\'s data', async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40
    var newDigest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5a'

    await app.issueMultipleTasks(accounts[0], [digest, digest, digest], [hashFunction, hashFunction, hashFunction], [size, size, size], [reward, reward, reward], [accounts[0], accounts[0], accounts[0]])

    const check1 = await app.changeSingleTaskData(0, newDigest, hashFunction+1, size+1)
    var task = await app.getTask(0)
    var check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, newDigest, hashFunction+1, size+1, account(0))
    assert.equal(true , check, 'The task\'s data should have been updated')

    const check2 = await app.changeMultipleTaskData([0,1,2], [newDigest,newDigest,newDigest], [hashFunction+1,hashFunction+1,hashFunction+1], [size+1,size+1,size+1])
    task = await app.getTask(1)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, newDigest, hashFunction+1, size+1, account(0))
    assert.equal(true , check, 'The task\'s data should have been updated')
    task = await app.getTask(2)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, newDigest, hashFunction+1, size+1, account(0))
    assert.equal(true , check, 'The task\'s data should have been updated')

    //sync
    newDigest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3faaaa'
    const check3 = await app.sync(["0xb4124ceb3451635dacedd11767f004d8a28c6ee7"],
    [0, 3, 0, 1, 2, 0, 0, 0], [19, 33, 19, 33, 19, 33], [newDigest, newDigest, newDigest])
    task = await app.getTask(0)
    var check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, newDigest, hashFunction+1, size+1, account(0))
    assert.equal(true , check, 'The task\'s data should have been updated')
    task = await app.getTask(1)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, newDigest, hashFunction+1, size+1, account(0))
    assert.equal(true , check, 'The task\'s data should have been updated')
    task = await app.getTask(2)
    check = compareTask(task[0], task[1].c[0], task[2].c[0], task[3], task[4].c[0], task[5].c[0], task[6],
      accounts[0], reward, 0, newDigest, hashFunction+1, size+1, account(0))
    assert.equal(true , check, 'The task\'s data should have been updated')
    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)
  })
  it('should delete task', async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40

    await app.issueMultipleTasks(accounts[0], [digest, digest, digest], [hashFunction, hashFunction, hashFunction], [size, size, size], [reward, reward, reward], [accounts[0], accounts[0], accounts[0]])

    const check1 = await app.killSingleTask(0)
    var task = await app.getTask(0)
    assert.equal(task[2].c[0], 5, 'The task should have been deleted')
    assert.equal(task[1].c[0], 0, 'The task should have been deleted')

    const rewardTokenAddress = await tokenManagerApp.rewardToken.call()
    const rewardTokenInstance = MiniMeToken.at(rewardTokenAddress)
    var contractBalance = await rewardTokenInstance.balanceOf.call(app.address)
    assert.equal(reward*2, contractBalance.toNumber(),
      'The contract\'s balance should have increased in the Reward Token contract')
    const check2 = await app.killMultipleTask([1,2])
    task = await app.getTask(1)
    assert.equal(task[2].c[0], 5, 'The task should have been deleted')
    assert.equal(task[1].c[0], 0, 'The task should have been deleted')
    task = await app.getTask(2)
    assert.equal(task[2].c[0], 5, 'The task should have been deleted')
    assert.equal(task[1].c[0], 0, 'The task should have been deleted')
    contractBalance = await rewardTokenInstance.balanceOf.call(app.address)
    assert.equal(0, contractBalance.toNumber(),
      'The contract\'s balance should have increased in the Reward Token contract')

    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])
    await app.issueTask(accounts[0], digest, hashFunction, size, reward, accounts[0])

    //sync
    const check3 = await app.sync(["0xb4124ceb3451635dacedd11767f004d8a28c6ee7"], [0, 0, 2, 3, 4, 0, 0], [], [])
    task = await app.getTask(3)
    assert.equal(task[2].c[0], 5, 'The task should have been deleted')
    assert.equal(task[1].c[0], 0, 'The task should have been deleted')
    task = await app.getTask(4)
    assert.equal(task[2].c[0], 5, 'The task should have been deleted')
    assert.equal(task[1].c[0], 0, 'The task should have been deleted')
    contractBalance = await rewardTokenInstance.balanceOf.call(app.address)
    assert.equal(0, contractBalance.toNumber(),
      'The contract\'s balance should have increased in the Reward Token contract')

    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)
  })
  it('should review task', async () => {
    const digest = '0xf38616d8e18e8c3ef009ac79996665b897b862e5917892d6a2c313895c3ffa5b',
          hashFunction = 18,
          size = 32,
          reward = 40,
          stage = 3

    await app.issueMultipleTasks(accounts[0], [digest, digest, digest, digest, digest], [hashFunction, hashFunction, hashFunction, hashFunction, hashFunction], [size, size, size, size, size], [reward, reward, reward, reward, reward], [accounts[0], accounts[0], accounts[0], accounts[0], accounts[0]])
    await app.assignMultipleTasks([0,1,2,3,4], [accounts[1],accounts[1],accounts[1],accounts[1],accounts[1]])

    await app.changeMultipleState([0,1,2,3,4], [stage,stage,stage,stage,stage])
    const check1 = await app.giveSingleReward(0);
    var task = await app.getTask(0)
    assert.equal(task[2].c[0], 4, 'The task\'s stage should have been changed')
    assert.equal(task[1].c[0], 0, 'The task\'s balance should have been changed to 0')

    const check2 = await app.giveMultipleReward([1,2]);
    task = await app.getTask(1)
    assert.equal(task[2].c[0], 4, 'The task\'s stage should have been changed')
    assert.equal(task[1].c[0], 0, 'The task\'s balance should have been changed to 0')

    task = await app.getTask(2)
    assert.equal(task[2].c[0], 4, 'The task\'s stage should have been changed')
    assert.equal(task[1].c[0], 0, 'The task\'s balance should have been changed to 0')

    //sync
    const check3 =  await app.sync(["0xb4124ceb3451635dacedd11767f004d8a28c6ee7"], [0, 0, 0, 0, 2, 3, 4], [4,4], [])
    task = await app.getTask(3)
    assert.equal(task[2].c[0], 4, 'The task\'s stage should have been changed')
    assert.equal(task[1].c[0], 0, 'The task\'s balance should have been changed to 0')

    task = await app.getTask(4)
    assert.equal(task[2].c[0], 4, 'The task\'s stage should have been changed')
    assert.equal(task[1].c[0], 0, 'The task\'s balance should have been changed to 0')

    console.log('Single  : ', check1.receipt.gasUsed)
    console.log('Multiple: ', check2.receipt.gasUsed)
    console.log('Sync    : ', check3.receipt.gasUsed)
  })
  // it('shouldn\'t allow an address to reward itself', async () => {should change task\'s stage
  //   await tokenManagerApp.mint(10)

  //   const account = accounts[0]
  //   const rewardAmount = 100

  //   await tokenManagerApp.claimRewardTokens(accounts[0])
  //   await assertRevert(() => tokenManagerApp.reward(account, account, rewardAmount))
  // })

  // it('shouldn\'t allow an address to claim his reward tokens more than once', async () => {
  //   await tokenManagerApp.mint(10)

  //   await tokenManagerApp.claimRewardTokens(accounts[0])
  //   await assertRevert(() => tokenManagerApp.claimRewardTokens(accounts[0]))
  // })

})

const addMembers = async (membersApp, accounts) => {
  await Promise.all(_.range(0, 5).map(async i =>
    await membersApp.addMember(accounts[i], 'Pesho', 2)
  ))
}
const account = (any) => {
  return '0x0000000000000000000000000000000000000000'
}
const compareTask = (issuer, balance, taskStage, digest, hashFunction, size, assignee, issuer2, balance2, taskStage2, digest2, hashFunction2, size2, assignee2) => {
  return (issuer == issuer2 &&
    balance == balance2 &&
    taskStage == taskStage2 &&
    digest == digest2 &&
    hashFunction == hashFunction2 &&
    size == size2 &&
    assignee == assignee2)
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