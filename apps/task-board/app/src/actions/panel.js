import { PanelMode } from '../components/Panels/TaskPanel'

export const TOGGLE_PANEL = 'TOGGLE_PANEL'
export const SET_PANEL_MODE = 'SET_PANEL_MODE'
export const SELECT_TASK = 'SELECT_TASK'

export const addTask = () => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.ADD })
}

export const editTask = task => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SELECT_TASK, payload: task })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.EDIT })
}

export const removeTask = task => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SELECT_TASK, payload: task })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.REMOVE })
}

export const closeAndReset = () => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.BASE })
}

export const togglePanel = () => ({
  type: TOGGLE_PANEL
})