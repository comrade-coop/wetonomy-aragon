import Reflux from 'reflux'
import MembersActions from '../actions/MembersActions'
import AppActions from '../actions/AppActions'

//TODO member.id -> member address?

var MembersStore = Reflux.createStore({
  listenables: [AppActions, MembersActions],
  init: function() {
    this.members  = {}
    this.feed = null
  },

  onInitialize: function(feed) {
    this.feed = feed
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