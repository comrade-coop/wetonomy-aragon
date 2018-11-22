async function createTokens(kitInstance) {
  console.log("Creating tokens...")
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
  const events = logs.filter(log => log.event === 'InstalledApp').map(log => log.args)

  if (!logs || logs.length == 0) {
    throw new Error('There should have been a DAO creation event')
  }

  const daoAddress = logs[0].args.dao

  if (!daoAddress || parseInt(daoAddress) === 0) {
    throw new Error('DAO should have a valid address')
  }

  return { daoAddress, events }
}

async function createDAOWithTokens(kitInstance) {
  const { rewardToken, daoToken } = await createTokens(kitInstance)
  console.log("Tokens Created")
  console.log(kitInstance.address)
  
  const { daoAddress, events } = await createDAO(kitInstance, rewardToken, daoToken)
  console.log(events)
  return { dao: daoAddress, events , rewardToken, daoToken }
}

async function getAppsProxyAddress(kernel, kit, events) {
  
  const namespace = await kernel.APP_BASES_NAMESPACE.call()

  const votingId = await kit.votingId.call()
  const membersId = await kit.membersId.call()
  const tokenManagerId = await kit.tokenManagerId.call()
  const timeTrackingId = await kit.timeTrackingId.call()
  const taskBoardId = await kit.taskBoardId.call()
  const parametersId = await kit.parametersId.call()

  const votingAddress = events.find(event => event.appId === votingId).appProxy
  const membersAddress = events.find(event => event.appId === membersId).appProxy
  const tokenManagerAddress = events.find(event => event.appId === tokenManagerId).appProxy
  const timeTrackingAddress = events.find(event => event.appId === timeTrackingId).appProxy
  const taskBoardAddress = events.find(event => event.appId === taskBoardId).appProxy
  const parametersAddress = events.find(event => event.appId === parametersId).appProxy
  
  return {
    voting: votingAddress,
    members: membersAddress,
    tokenManager: tokenManagerAddress,
    timeTracking: timeTrackingAddress,
    taskBoard: taskBoardAddress,
    parameters: parametersAddress
  }
}

module.exports = { createTokens, createDAO, createDAOWithTokens, getAppsProxyAddress }
