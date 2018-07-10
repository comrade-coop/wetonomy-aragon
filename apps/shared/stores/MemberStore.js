'use strict'

import Reflux from 'eflux'
import DBStore from 'stores/DBStore'

var MemberStore = Reflux.createStore({
  init: function() {
    this.member = null

    DBStore.listen((orbit) => {
      orbit.events.on('connected', (network, member) => {
        this._update(member)
      })
    })
  },

  onDisconnect: function() {
    this._update(null)
  },

  _update: function(member) {
    this.member = member

    this.trigger(this.member)
  }
})

export default MemberStore