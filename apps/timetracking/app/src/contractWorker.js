import Aragon from '@aragon/client'
// import {Events, Methods} from './utils/membersContractWrapper'
// import {of} from './rxjs'
// import {range} from './utils/utility'
// import Member from './models/Member'

const INITIALIZATION_TRIGGER = 'INITIALIZATION_TRIGGER'

const app = new Aragon()
app.store(async (state, {event, returnValues}) => {
  switch (event) {
    case 'HoursTracked':
      return onEvent({ count: 'Synced' },returnValues)
    case 'TokensClaimed':
      return onTokensClaimed(state,returnValues)
    case 'Balance':
      return onEvent({ count: 'Balans' },returnValues)
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
  console.log({ rewardTokens: tokens})
  console.log(state)
  return { rewardTokens: tokens}
}
const loadCurrentBalance = async(from) => {
  console.log('getBalance')
  const balanceResult = await callReadMethod('getBalance', from)
  const balance = parseInt(balanceResult[0])
  return balance
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