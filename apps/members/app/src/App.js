import React from 'react'

import {AragonApp} from '@aragon/ui'
import Header from './components/Header'
import Main from './components/Main'

class App extends React.Component {
  render() {
    return (
      <AragonApp>
        <Header />
        <Main />
      </AragonApp>
    )
  }
}

export default App
