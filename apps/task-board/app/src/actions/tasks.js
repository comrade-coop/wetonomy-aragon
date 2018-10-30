import * as Api from '../utils/api'

export const LOAD_FULL_STATE = 'LOAD_FULL_STATE'
export const RELOAD_FULL_STATE = 'RELOAD_FULL_STATE'
export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const CONTRIBUTE_TOKENS = 'CONTRIBUTE_TOKENS'
export const ACCEPT_TASK = 'ACCEPT_TASK'
export const FINISH_TASK = 'FINISH_TASK'
export const REWARD_TASK = 'REWARD_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'
export const MOVE_TASK = 'MOVE_TASK'
export const RELOAD_TASK = 'RELOAD_TASK'
export const ERROR_TASK = 'ERROR_TASK'
export const CLEAR_ERROR = 'CLEAR_ERROR'
export const SYNC_ACTIVITY = 'SYNC_ACTIVITY'
export const LOAD_ACCOUNT = 'LOAD_ACCOUNT'

export const loadFullState = (window) => async(dispatch) => {
  Api.initializeApp(window, state => {
    dispatch({
      type: LOAD_FULL_STATE,
      payload: { ...state }
    })
  })
  var user = await Api.loadCurrentAccount()
  // Maybe remove in the future, for now needed for test purposes
  setInterval(async() =>{
    if (await  Api.loadCurrentAccount() !== user) {
      user = await  Api.loadCurrentAccount()
      const acc = await Api.callReadMethod('getAccount',user )
      dispatch({
        type: LOAD_ACCOUNT,
        payload: { 
          account: {reward: parseInt(acc[0]), dao: parseInt(acc[1])},
          user: user
        }
      })
    }
  }, 100)

  const acc = await Api.callReadMethod('getAccount',user )
  console.log('ioko',acc)
  dispatch({
    type: LOAD_ACCOUNT,
    payload: { 
      account: {reward: parseInt(acc[0]), dao: parseInt(acc[1])},
      user: user
    }
  })
}
export const reloadFullState = () => dispatch => {
  dispatch({
    type: RELOAD_FULL_STATE
  })
}
export const syncActivities = (activities) => dispatch => {
  Api.syncActivities(activities)
  dispatch({
    type: SYNC_ACTIVITY,
  })
}

export const reloadTaskState = (task) => dispatch => {
  dispatch({
    type: RELOAD_TASK,
    payload: { task }
  })
}

export const addTask = task => dispatch => {
  Api.addTask(task)
  dispatch({
    type: ADD_TASK,
    payload: task
  })
}

export const addTaskUI = task => dispatch => {
  dispatch({
    type: ADD_TASK,
    payload: { task }
  })
}

export const updateTask = (oldTask, newTask) => dispatch => {
  console.log(oldTask, newTask)
  Api.updateTask(oldTask, newTask)
  dispatch({
    type: UPDATE_TASK,
    payload: newTask
  })
}

export const updateTaskUI = (task) => dispatch => {
  console.log(task)
  dispatch({
    type: UPDATE_TASK,
    payload: {task}
  })
}

export const contributeTokens = (task, tokens) => dispatch => {
  console.log(task, tokens)
  Api.contributeTokens(task, tokens)
  dispatch({
    type: CONTRIBUTE_TOKENS,
    payload: {...task,tokens}
  })
}

export const acceptTask = task => dispatch => {
  Api.acceptTask(task)
  dispatch({
    type: ACCEPT_TASK,
    payload: {...task}
  })
}
export const acceptTaskUI = (task, stage = 1) => dispatch => {
  dispatch({
    type: ACCEPT_TASK,
    payload: {task, stage}
  })
}


export const finishTask = task => dispatch => {
  Api.finishTask(task)
  dispatch({
    type: FINISH_TASK,
    payload: {...task}
  })
}
export const finishTaskUI = task => dispatch => {
  dispatch({
    type: FINISH_TASK,
    payload: {...task}
  })
}
export const rewardTask = task => dispatch => {
  Api.rewardTask(task)
  dispatch({
    type: REWARD_TASK,
    payload: {...task}
  })
}
export const rewardTaskUI = task => dispatch => {
  dispatch({
    type: REWARD_TASK,
    payload: {task}
  })
}

export const moveTask = (task, stage) => dispatch => {
  Api.moveTask(task, stage)
  dispatch({
    type: MOVE_TASK,
    payload: {task,stage}
  })
}

export const moveTaskUI = (task, stage) => dispatch => {
  dispatch({
    type: MOVE_TASK,
    payload: {task,stage}
  })
}

export const removeTask = task => dispatch => {
  Api.removeTask(task)
  dispatch({
    type: REMOVE_TASK,
    payload: task
  })
}

export const removeTaskUI = task => dispatch => {
  dispatch({
    type: REMOVE_TASK,
    payload: {task}
  })
}

export const errorTask = (task,error) => dispatch => {
  dispatch({
    type: ERROR_TASK,
    payload: {task, error}
  })
}

export const clearError = (task) => dispatch => {
  dispatch({
    type: CLEAR_ERROR,
    payload: {task}
  })
}