import { PanelMode } from '../components/Panels/MemberPanel'

export const TOGGLE_PANEL = 'TOGGLE_PANEL'
export const SET_PANEL_MODE = 'SET_PANEL_MODE'
export const SELECT_MEMBER = 'SELECT_MEMBER'

export const addMember = () => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.ADD })
}

export const editMember = member => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SELECT_MEMBER, payload: member })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.EDIT })
}

export const removeMember = member => dispatch => {
  dispatch({ type: TOGGLE_PANEL })
  dispatch({ type: SELECT_MEMBER, payload: member })
  dispatch({ type: SET_PANEL_MODE, payload: PanelMode.REMOVE })
}

export const togglePanel = () => ({
  type: TOGGLE_PANEL
})