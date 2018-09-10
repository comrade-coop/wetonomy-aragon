import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import ConnectedApp from './ConnectedApp'

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,  
  document.getElementById('root')
)
