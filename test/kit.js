const { assertRevert } = require('@aragon/test-helpers/assertThrow')
const { createDAO } = require('../scripts/util')
const WetonomyKit = artifacts.require('WetonomyKit')

contract('WetonomyKit', async () => {
  it('should create required by DAO tokens', async () => {
    const { rewardToken, daoToken } = await createTokens()
    assert.notEqual(
      parseInt(rewardToken),
      0,
      'A Reward token contract should have been created'
    )
    assert.notEqual(
      parseInt(daoToken),
      0,
      'A DAO token contract should have been created'
    )
  })

  it('should create a Wetonomy DAO', async () => {
    const kit = await WetonomyKit.deployed()
    const { rewardToken, daoToken } = await createTokens()

    const { dao } = await createDAO(kit, rewardToken, daoToken)

    assert.notEqual(
      parseInt(dao),
      0,
      'DAO should have been created on a valid address'
    )
  })

  it('should revert at DAO creation if tokens are not valid', async () => {
    const kit = await WetonomyKit.deployed()
    await assertRevert(() => kit.newInstance(0, 0))
  })

  async function createTokens() {
    const kitInstance = await WetonomyKit.deployed()
    const { logs } = await kitInstance.createDAOTokens(
      'Reward',
      18,
      'RWD',
      'DAO Tokens',
      18,
      'DAO'
    )

    assert.notEqual(
      logs.length,
      0,
      'There should have been a Token creation event'
    )

    const { rewardToken, daoToken } = logs[0].args
    return { rewardToken, daoToken }
  }
})
