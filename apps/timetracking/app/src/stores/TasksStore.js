import Reflux from 'reflux'
import TasksActions from 'actions/TasksActions'

//TODO task.id -> task address?


var TasksStore = Reflux.createStore({
  listenables: [TasksActions],
  init: function() {
    this.tasks  = {}
  },

  onInitialize: function(feed) {
    this.feed = feed
  },

  onDisconnect: function() {
    this.tasks = {}
    this.trigger(this.tasks)
  },

  onAddTask: function(task) {
    if(!this.tasks[task.id])
      this.tasks[task.id] = task
  },
  
  onGetTask: function(id, callback) {
    if (this.tasks[id])
      return callback(null, this.tasks[id])

    this.orbit.getTask(id).then((task) => {
      this.tasks[id] = task
      callback(null, task)
    })
  }
})

export default TasksStore
