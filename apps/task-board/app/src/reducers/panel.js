import { PanelMode } from '../components/Panels/TaskPanel'
import { TOGGLE_PANEL, SET_PANEL_MODE, SELECT_TASK } from '../actions/panel'

const initialState = {
  opened: false,
  mode: PanelMode.ADD,
  selectedTask: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PANEL:
      return { ...state, opened: !state.opened }
    case SET_PANEL_MODE:
      return { ...state, mode: action.payload }
    case SELECT_TASK:
      return { ...state, selectedTask: action.payload }
    default:
      return state
  }
}