import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'

import store from './store'
import ConnectedApp from './ConnectedApp'

ReactDOM.render(  
  <Provider store={store}>
    <HashRouter>
      <ConnectedApp />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)