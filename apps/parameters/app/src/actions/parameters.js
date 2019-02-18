import * as Api from '../utils/api'

export const LOAD_FULL_STATE = 'LOAD_FULL_STATE'
export const LOAD_PARAMETERS = 'LOAD_PARAMETERS'
export const TOKEN_CHANGE = 'TOKEN_CHANGE'
export const NOTIFICATIONS_ENABLED = 'NOTIFICATIONS_ENABLED'

export const parameterChange = (type, parameter) => dispatch => {
  Api.parameterChange(type, parameter)
  dispatch({
    type: NOTIFICATIONS_ENABLED
  })
}
export const tokenChartChange = (type) => dispatch =>(
  dispatch({
    type: TOKEN_CHANGE,
    payload: type 
  })
)

export const loadFullState = (window) => async(dispatch) => {
  Api.initializeApp(window, state => {
    dispatch({
      type: LOAD_FULL_STATE,
      payload: { ...state }
    })  
  })  
  const rewardTokenHistory = await Api.loadRewardTokenHistory()
  const debtTokenHistory = await Api.loadDebtTokenHistory()
  const userTokens = await Api.loadUserTokens()
  const memberParameters =  await Api.callReadMethod('getMemberesParameters')
  const tokenManagerParameters =  await Api.callReadMethod('getTokenManagerParameters')
  const timeTrackingParameters =  await Api.callReadMethod('getTokenTimeTrackingParameters')
  const members =  await Api.callReadMethod('members')
  const timeTracking =  await Api.callReadMethod('timeTracking')
  const tokenManager =  await Api.callReadMethod('tokenManager')
  const parameters = {
    membersAddress: members,
    timeTrackingAddress: timeTracking,
    tokenManagerAddress: tokenManager,
    initialReputation: memberParameters,
    inflationMultiplier: tokenManagerParameters[0],
    rewardToDebtCourse: tokenManagerParameters[1],
    periodLength: parseInt(timeTrackingParameters[0])/(60 * 60 * 24),
    maxHoursPerPeriod: timeTrackingParameters[1],
    rewardTokenHistory: rewardTokenHistory,
    debtTokenHistory: debtTokenHistory,
    userTokens: userTokens
  }

  dispatch({
    type: LOAD_PARAMETERS,
    payload: parameters
  })
}