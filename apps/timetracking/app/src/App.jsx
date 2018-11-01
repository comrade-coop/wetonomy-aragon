import React from 'react'
import { AragonApp } from '@aragon/ui'
import AppHeaderContainer from './containers/AppHeaderContainer'
import WeekContainer from './containers/WeekContainer'
import PanelContainer from './containers/PanelContainer'

const App = () => {
  return (
    <AragonApp>
      <AppHeaderContainer/>
      <WeekContainer/>
      <PanelContainer />
    </AragonApp>
  )
}

export default App 

