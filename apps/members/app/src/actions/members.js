import * as Api from '../utils/membersApi'

export const LOAD_FULL_STATE = 'LOAD_FULL_STATE'
export const ADD_MEMBER = 'ADD_MEMBER'
export const UPDATE_MEMBER = 'UPDATE_MEMBER'
export const REMOVE_MEMBER = 'REMOVE_MEMBER'

export const loadFullState = (window) => dispatch => {
  Api.initializeApp(window, state => {
    dispatch({
      type: LOAD_FULL_STATE,
      payload: { ...state }
    })  
  })  
}

export const addMember = member => dispatch => {
  Api.addMember(member)
  dispatch({
    type: ADD_MEMBER,
    payload: member
  })
}

export const updateMember = (oldMember, newMember) => dispatch => {
  Api.updateMember(oldMember, newMember)
  dispatch({
    type: UPDATE_MEMBER,
    payload: newMember
  })
}

export const removeMember = member => dispatch => {
  Api.removeMember(member)
  dispatch({
    type: REMOVE_MEMBER,
    payload: member
  })
}