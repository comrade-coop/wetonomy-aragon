'use strict'

import Reflux from 'reflux'

var DBActions = Reflux.createActions([
  {
    actionName: 'create', 
    asyncResult: true, 
    sync: false
  },
  {
    actionName: 'load',
    asyncResult: true,
    sync: false 
  },
  {
    actionName: 'open',
    asyncResult: true,
    sync: false 
  },
  {
    actionName: 'reset',
    asyncResult: true,
    sync: false 
  },
  {
    actionName: 'query',
    asyncResult: true,
    sync: false 
  }
])

export default DBActions