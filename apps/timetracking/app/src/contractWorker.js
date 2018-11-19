import Aragon from '@aragon/client'

const app = new Aragon()
app.store(async (state, {event, returnValues}) => {
  switch (event) {
    case 'HoursTracked':
      return onEvent({ count: 'Synced' },returnValues)
    case 'TokensClaimed':
      return onTokensClaimed(state,returnValues)
    default:
      return log({ count: 'Not OK' },event,state,returnValues)
  }
})


/***********************
 * Event Handlers      *
 ***********************/



/***********************
 * Read Handles        *
 ***********************/
const log = async(ret,event,state, returnValues) => {
  console.log(returnValues)
  console.log(event)
  console.log(state)
  return ret
}

const onEvent = async (state, returnValues) => {
  console.log(returnValues)

  return state
}

const onTokensClaimed = async (state, returnValues) => {
  console.log('Tokens Claimed')
  console.log(returnValues)
  const tokens = await loadCurrentBalance(returnValues.from)
  console.log(state)
  return {userTokens: tokens}
}

const loadCurrentBalance = async(from) => {
  console.log('getBalance')
  const balanceResult = await callReadMethod('getBalance', from)
  const reward = parseInt(balanceResult[0])
  const debt = parseInt(balanceResult[1])
  return {reward: reward, debt: debt}
}

const callReadMethod = (method, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      app
        .call(method, ...args)
        .first()
        .subscribe(result => {
          resolve(result)
        })
    } catch (error) {
      reject(error)
    }
  })
}