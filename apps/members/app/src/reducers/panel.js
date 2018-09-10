import { PanelMode } from '../components/Panels/MemberPanel'
import { TOGGLE_PANEL, SET_PANEL_MODE, SELECT_MEMBER } from '../actions/panel'

const initialState = {
  opened: false,
  mode: PanelMode.ADD,
  selectedMember: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_PANEL:
      return { ...state, opened: !state.opened }
    case SET_PANEL_MODE:
      return { ...state, mode: action.payload }
    case SELECT_MEMBER:
      return { ...state, selectedMember: action.payload }
    default:
      return state
  }
}