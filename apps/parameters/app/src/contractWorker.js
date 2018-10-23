import Aragon from '@aragon/client'
import _ from 'lodash'

const app = new Aragon()

app.store(async (state, {event, returnValues}) => {
  switch (event) {
    case 'NewVotingCreated':
      return await onVotingCreated(event, state, returnValues)
    default:
      return log(event,state,returnValues)
  }
})


/***********************
 * Event Handlers      *
 ***********************/



/***********************
 * Read Handles        *
 ***********************/
// const loadCompleteState = async() => {
//   // const tasks = await loadTasks()
//   const currentUser = await loadCurrentAccount()

//   const balance = await loadCurrentBalance(currentUser)
//   return { tasks, balance, currentUser}
// }

const onVotingCreated = async (event, state, returnValues) => {
  console.log(event, returnValues)
  // const newState = await loadCompleteState()
  console.log(state)
  return {newVote: true, id: returnValues.voteId}
}


const log = async(event, state, returnValues) => {
  console.log('default: ', event, ':', returnValues)
  return state
}

const loadCurrentBalance = async(from) => {
  const balanceResult = await callReadMethod('getAccount', from)
  console.log('getBalance', balanceResult)
  const balance = parseInt(balanceResult)
  return balance
}
const loadCurrentAccount = () => {
  return new Promise((resolve, reject) => {
    try {
      app.accounts().subscribe(accounts => {
        const currentAccount = accounts[0]
        if (currentAccount) {
          resolve(currentAccount)
        } else {
          reject('A valid account address wasn\'t found')
        }

      })
    } catch (error) {
      reject(error)
    }
  })
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