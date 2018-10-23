import { PanelMode } from '../utils/appConstants'

export const TOGGLE_PANEL = 'TOGGLE_PANEL'
export const SET_PANEL_MODE = 'SET_PANEL_MODE'
export const SELECT_TASK = 'SELECT_TASK'

export const closeAndReset = () => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.BASE })
}
export const togglePanelWithType = type => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SET_PANEL_MODE, payload: type })
}
export const togglePanel = () => ({
  type: TOGGLE_PANEL
})