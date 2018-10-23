import React from 'react'
import { connect } from 'react-redux'
import {AragonApp} from '@aragon/ui'
import PanelContainer from './containers/PanelContainer'
import ParameterContainer from './containers/ParameterContainer'
import './App.css'
import AppHeaderContainer from './containers/AppHeaderContainer'

const App = () => (
  <AragonApp>
    <AppHeaderContainer/>
    <ParameterContainer/>
    <PanelContainer/>
  </AragonApp>
)



export default connect()(App)
