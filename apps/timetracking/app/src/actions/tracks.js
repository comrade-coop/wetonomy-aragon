import * as Api from '../utils/api'

export const LOAD_FULL_STATE = 'LOAD_FULL_STATE'
export const LOAD_ACCOUNT = 'LOAD_ACCOUNT'
export const WEEK_CHANGE = 'WEEK_CHANGE'
export const SYNC_HOURS = 'SYNC_HOURS'
export const CLAIM_TOKENS = 'CLAIM_TOKENS'
export const SYNC_AND_CLAIM = 'SYNC_AND_CLAIM'
export const SELECTED_WORK = 'SELECTED_WORK'
export const SELECTED_DAY = 'SELECTED_DAY'
export const UPDATE_WORK = 'UPDATE_WORK'
export const TRACK_WORK = 'TRACK_WORK'
export const DELETE_WORK = 'DELETE_WORK'
export const CURRENT_WEEK = 'CURRENT_WEEK'

export const loadFullState = (window) => async(dispatch) => {
  Api.initializeApp(window, state => {
    dispatch({
      type: LOAD_FULL_STATE,
      payload: { ...state }
    })  
  })
  const user = await Api.loadCurrentAccount()
  const tokens = await Api.callReadMethod('getBalance', user)

  if(tokens)
    dispatch({
      type: LOAD_ACCOUNT,
      payload: {reward: parseInt(tokens[0]), debt: parseInt(tokens[1])} 
    }) 
}

export const changeWeek = (direction, today) => dispatch => {
  if(direction === 1) {
    today.setDate(today.getDate() + 7)
  }
  else today.setDate(today.getDate() - 7)

  dispatch({
    type: WEEK_CHANGE,
    payload: today.getTime() 
  })
}

export const syncHours = (hours) => dispatch => {
  Api.syncHours(hours)
  // ipfs sync here
  dispatch({
    type: SYNC_HOURS,
    payload: hours
  })
}
export const claimTokens = () => dispatch => {
  Api.claimTokens()
  dispatch({
    type: CLAIM_TOKENS
  })
}

export const syncAndClaim = (hours) => dispatch => {
  Api.syncAndClaim(hours)
  //ipfs sync here
  dispatch({
    type: SYNC_HOURS
  })
}

export const selectedWork = track => dispatch => {
  dispatch({ type: SELECTED_WORK, payload: track })
}

export const currentWeek = () => ({ type: CURRENT_WEEK })

export const selectedDay = day => dispatch => {
  //ipfs sync here
  dispatch({ type: SELECTED_DAY, payload: day })
}

export const updateWork = work => dispatch => {
  //ipfs sync here
  dispatch({ type: UPDATE_WORK, payload: {work}  })
}

export const trackWork = work => dispatch => {
  dispatch({ type: TRACK_WORK, payload: {work} })
}

export const deleteWork = work => dispatch => {
  dispatch({ type: DELETE_WORK, payload: {work} })
}