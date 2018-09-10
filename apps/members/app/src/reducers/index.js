import { combineReducers } from 'redux'

import members from './members'
import panel from './panel'

export default combineReducers({ members, panel })