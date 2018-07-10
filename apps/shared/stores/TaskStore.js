'use strict'

import Reflux from 'reflux'
import DBStore from 'stores/DBStore'
import TaskActions from 'actions/TaskActions'

var TaskStore = Reflux.createStore({
  listenables: [TaskActions],
  init: function() {
    this.task = null
    DBStore.listen((orbit) => {
      orbit.events.on('connected', (task) => {
        this._update(task)
      })
    })
  },
  
  trackHours: function(hours){

  },

  _update: function(task) {
    this.task = task

    this.trigger(this.task)
  }
})

export default TaskStore