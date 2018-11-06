async function createTokens(kitInstance) {
  const { logs } = await kitInstance.createDAOTokens(
    'Reward',
    18,
    'RWD',
    'DAO Tokens',
    18,
    'DAO'
  )

  if (!logs || logs.length == 0) {
    throw new Error('There should have been a Token creation event')
  }

  const { rewardToken, daoToken } = logs[0].args

  if (!rewardToken || !daoToken) {
    throw new Error('Tokens should have been defined')
  }

  return { rewardToken, daoToken }
}

async function createDAO(kitInstance, rewardToken, daoToken) {
  const daoTx = await kitInstance.newInstance(rewardToken, daoToken)
  const { logs } = daoTx

  if (!logs || logs.length == 0) {
    throw new Error('There should have been a DAO creation event')
  }

  const daoAddress = logs[0].args.dao

  if (!daoAddress || parseInt(daoAddress) === 0) {
    throw new Error('DAO should have a valid address')
  }

  return daoAddress
}

async function createDAOWithTokens(kitInstance) {
  const { rewardToken, daoToken } = await createTokens(kitInstance)
  const dao = await createDAO(kitInstance, rewardToken, daoToken)
  return { dao, rewardToken, daoToken }
}

module.exports = { createTokens, createDAO, createDAOWithTokens }
