import Aragon from '@aragon/client'
import {Events, Methods} from './utils/membersContractWrapper'
import {of} from './rxjs'
import {range} from './utils/utility'
import Member from './models/Member'

const INITIALIZATION_TRIGGER = 'INITIALIZATION_TRIGGER'

const app = new Aragon()

app.store(async(state, {event, returnValues}) => {
  switch (event) {
    case INITIALIZATION_TRIGGER:
      return await loadMembers(state)
    case Events.MEMBER_ADDED:
      return await onMemberAdd(state, returnValues)
    case Events.MEMBER_REMOVED:
      return await onMemberRemove(state, returnValues)
    default:
      return state
  }
}, [of({event: INITIALIZATION_TRIGGER})])

/***********************
 * Event Handlers      *
 ***********************/

const onMemberAdd = (state, returnValues) => {
  console.log('A new member was added!', returnValues)
  const nextState = loadMembers(state)
  return nextState
}

const onMemberRemove = (state, returnValues) => {
  console.log('A member was removed!', returnValues)
  const nextState = loadMembers(state)
  return nextState
}

/***********************
 * Read Handles        *
 ***********************/

const loadMembers = async(state) => {
  const count = await loadMembersCount()
  if (count === 0) {
    return state
  }

  const members = await Promise.all(range(count).map(async index => await loadMember(index)))

  return {
    ...state,
    members
  }
}

const loadMembersCount = async() => {
  const countResult = await callReadMethod(Methods.GET_MEMBERS_COUNT)
  const count = parseInt(countResult)
  return count
}

const loadMember = async(index) => {
  const memberResult = await callReadMethod(Methods.GET_MEMBER, index)
  const member = new Member(memberResult.name, memberResult.accountAddress, memberResult.level)
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