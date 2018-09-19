import { LOAD_FULL_STATE } from '../actions/members'
// import { getMembers } from '../utils/dummyDataProvider'

// export const initialState = {
//   members: getMembers(10),
//   currentMember: getMembers(1)[0]
// }

export const initialState = {
  members: [],
  currentMember: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FULL_STATE: 
      return reduceFullState(state, action.payload)    
    default:
      return state
  }
}

const reduceFullState = (state, contractState) => {
  const nextState = { ...state, ...contractState }
  return nextState
}