import Aragon from '@aragon/client'
import {Events, Methods} from './utils/membersContractWrapper'
import {range} from './utils/utility'
import Member from './models/Member'

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
  const nextState = { ...state, members: await loadMembers(state) }
  return nextState
}

const onMemberUpdate = async (state, returnValues) => {
  console.log('A new member was updated!', returnValues)
  const memberId = returnValues.id
  const updatedMember = await loadMember(memberId)
  const nextState = { 
    ...state,
    members: await loadMembers(state),
    updatedMember 
  }
  return nextState
}

const onMemberRemove = async (state, returnValues) => {
  console.log('A member was removed!', returnValues)
  const nextState = { ...state, members: await loadMembers(state) }
  return nextState
}

/***********************
 * Read Handles        *
 ***********************/

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
  const member = new Member(memberResult.name, memberResult.accountAddress, memberResult.level, id)
  return member
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