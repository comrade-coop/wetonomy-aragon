import React from 'react'
import {AragonApp} from '@aragon/ui'

import TaskPanelContainer from './containers/TaskPanelContainer'
import TaskScreenContainer from './containers/TaskScreenContainer'
import TaskActionContainer from './containers/TaskActionContainer'
import './App.css'
import AppHeaderContainer from './containers/AppHeaderContainer'

const App = () => (
  <AragonApp>
    <AppHeaderContainer />
    <TaskActionContainer />
    <TaskScreenContainer />
    <TaskPanelContainer />
  </AragonApp>
)


export default App
