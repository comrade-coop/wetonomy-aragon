'use strict'

import Reflux from 'reflux'
import MembersActions from 'actions/MembersActions'

//TODO member.id -> member address?


var MembersStore = Reflux.createStore({
  listenables: [MembersActions],
  init: function() {
    this.members  = {}
  },

  onInitialize: function(orbit) {
    this.orbit = orbit
  },

  onDisconnect: function() {
    this.members = {}
    this.trigger(this.members)
  },

  onAddMember: function(member) {
    if(!this.members[member.id])
      this.members[member.id] = member
  },
  
  onGetMember: function(id, callback) {
    if (this.members[id])
      return callback(null, this.members[id])

    this.orbit.getMember(id).then((member) => {
      this.members[id] = member
      callback(null, member)
    })
  }
})

export default MembersStore
