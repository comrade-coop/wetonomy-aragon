import { combineReducers } from 'redux'

import tasks from './tasks'
import panel from './panel'
import activities from './activities'

export default combineReducers({ tasks, panel, activities })