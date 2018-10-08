import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Switch, Redirect, Route, withRouter } from 'react-router-dom'

import BoardScreen from '../screens/BoardScreen'
import { editTask } from '../actions/panel'

class TaskScreenContainer extends Component {

  handleEditTask = (task) => {
    const { dispatch } = this.props
    dispatch(editTask(task))
  }

  render() {
    return (
      <Switch>
        <Route path="/timeline" component={() => <h1>Timeline</h1>}/>
        <Route path="/" component={() => <BoardScreen onEditTaskClick={this.handleEditTask} />}/>
        <Route path="/my-tasks" component={() => <h1>My Tasks</h1>}/>
        {/* <Redirect from="/" to="/dashboard"/> */}
      </Switch>
    )
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks.tasks
})

export default withRouter(connect(mapStateToProps)(TaskScreenContainer))
