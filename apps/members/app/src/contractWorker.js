import Aragon from '@aragon/client'
import {Events, Methods} from './utils/membersContractWrapper'
import {range} from './utils/utility'
import createMember from './models/Member'

const app = new Aragon()

app.store(async (state, {event, returnValues}) => {
  switch (event) {
    case Events.MEMBER_ADDED:
      return await onMemberAdd(state, returnValues)
    case Events.MEMBER_UPDATED:
      return await onMemberUpdate(state, returnValues)
    case Events.MEMBER_REMOVED:
      return await onMemberRemove(state, returnValues)    
    default:
      return state
  }
})

/***********************
 * Event Handlers      *
 ***********************/

const onMemberAdd = async (state, returnValues) => {
  console.log('A new member was added!', returnValues)
  const fetchedState = await loadCompleteState()
  const nextState = { ...state, ...fetchedState }
  return nextState
}

const onMemberUpdate = async (state, returnValues) => {
  console.log('A new member was updated!', returnValues)

  const fetchedState = await loadCompleteState()

  const memberId = returnValues.id
  const updatedMember = await loadMember(memberId)
  

  const nextState = { 
    ...state,
    ...fetchedState,
    updatedMember 
  }
  return nextState
}

const onMemberRemove = async (state, returnValues) => {
  console.log('A member was removed!', returnValues)
  const fetchedState = await loadCompleteState()
  const nextState = { ...state, ...fetchedState }
  return nextState
}

/***********************
 * Read Handles        *
 ***********************/

const loadCompleteState = async() => {
  const members = await loadMembers()
  const currentMember = await findCurrentMember(members)

  return { members, currentMember }
}

const loadMembers = async() => {
  const count = await loadMembersCount()
  if (count === 0) {
    return []
  }

  console.log('Member count is: ', count)

  const members = await Promise.all(range(count).map(async index => await loadMember(index)))

  return members
}

const loadMembersCount = async() => {
  const countResult = await callReadMethod(Methods.GET_MEMBERS_COUNT)
  const count = parseInt(countResult)
  return count
}

const loadMember = async(id) => {
  const memberResult = await callReadMethod(Methods.GET_MEMBER, id)
  const member = createMember(memberResult.name, memberResult.accountAddress, memberResult.level, id)
  return member
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

const findCurrentMember = async (members) => {
  const currentAccount = await loadCurrentAccount()
  if (currentAccount) {
    const currentMember = members.find(member => member.address === currentAccount)
    return currentMember
  }  
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
