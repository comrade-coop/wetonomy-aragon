export const TOGGLE_WINDOW = 'TOGGLE_WINDOW'
export const CONTRIBUTE_ACTIVITY = 'CONTRIBUTE_ACTIVITY'
export const STAGE_CHANGE_ACTIVITY = 'STAGE_CHANGE_ACTIVITY'
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY'
export const CREATE_ACTIVITY = 'CREATE_ACTIVITY'
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY'
export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY'
export const CLEAR_ACTIVITY = 'CLEAR_ACTIVITY'

export const contributeActivity = (task, tokens) => dispatch => {
  dispatch({ type: CONTRIBUTE_ACTIVITY, payload: {task, tokens} })
}
export const deleteActivity = (task, type) => dispatch => {
  dispatch({ type: DELETE_ACTIVITY, payload: {task, type} })
}
export const stageChangeActivity = (task, stage) => dispatch => {
  dispatch({ type: STAGE_CHANGE_ACTIVITY, payload: {task, stage} })
}
export const createActivity = (task) => dispatch => {
  dispatch({ type: CREATE_ACTIVITY, payload: {task} })
}
export const removeActivity = (task) => dispatch => {
  dispatch({ type: REMOVE_ACTIVITY, payload: {task} })
}
export const updateActivity = (task) => dispatch => {
  dispatch({ type: UPDATE_ACTIVITY, payload: {task} })
}
export const clearActivities = () => dispatch => {
  dispatch({ type: CLEAR_ACTIVITY, payload: {} })
}
export const toggleWindow = () => ({
  type: TOGGLE_WINDOW
})