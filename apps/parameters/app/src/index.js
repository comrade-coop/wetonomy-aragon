import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from './store'
import ConnectedApp from './ConnectedApp'

ReactDOM.render(  
  <Provider store={store}>
    <BrowserRouter>
      <ConnectedApp />
    </BrowserRouter>      
  </Provider>,
  document.getElementById('root')
)