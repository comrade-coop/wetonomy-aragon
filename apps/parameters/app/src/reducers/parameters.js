import { LOAD_FULL_STATE, LOAD_PARAMETERS, TOKEN_CHANGE, NOTIFICATIONS_ENABLED } from '../actions/parameters'
import { TokenType } from '../utils/appConstants'
export const initialState = {
  currentUser: '',
  initialReputation: 0,
  inflationMultiplier: 0,
  rewardToDebtCourse: 0,
  periodLength: 0,
  maxHoursPerPeriod: 0,
  membersAddress: '',
  timeTrackingAddress: '',
  tokenManagerAddress: '',
  rewardTokenHistory: [],
  debtTokenHistory: [],
  userTokens: {reward: 0, debt: 0},
  tokenChart: TokenType.DEBT,
  notification: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FULL_STATE: 
      return reduceFullState(state, action.payload)  
    case LOAD_PARAMETERS: 
      return loadParameters(state, action.payload)
    case TOKEN_CHANGE:
      return { ...state, tokenChart: action.payload }
    case NOTIFICATIONS_ENABLED:
      return { ...state, notification: !state.notification }
    default:
      return state
  }
}

const reduceFullState = (state, contractState) => {
  let element = document.getElementById('newVote')
  if(state.notification)
    element.style.opacity = 1
  setTimeout(() => {
    element.style.opacity = 0
  }, 5000)
  const nextState = { ...state, ...contractState }
  return nextState
}
const loadParameters = (state, parameters) => {
  const nextState = { ...state, ...parameters }
  return nextState
}