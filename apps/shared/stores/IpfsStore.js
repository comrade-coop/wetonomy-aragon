'use strict'

import IPFS from 'ipfs'
import IPFSActions from 'actions/IPFSActions'


var IPFSStore = Reflux.createStore({
  listenables: [IPFSActions],
  init: function () {
    
  },
  
  onStart: function (user) {
    
  },
  
  onStop: function () {
  }
})

export default IPFSStore
