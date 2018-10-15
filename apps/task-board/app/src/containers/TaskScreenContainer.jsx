import React, { Component } from 'react'
import {connect} from 'react-redux'
import { Switch, Redirect, Route, withRouter } from 'react-router-dom'

import BoardScreen from '../screens/BoardScreen'
import ExploreScreen from '../screens/ExploreScreen'
import { editTask } from '../actions/panel'

class TaskScreenContainer extends Component {

  handleEditTask = (task) => {
    const { dispatch } = this.props
    dispatch(editTask(task))
  }

  render() {
    return (
      <Switch>
        <Route path="/explore" component={() => <ExploreScreen />}/>
        <Route path="/dashboard" component={() => <BoardScreen onEditTaskClick={this.handleEditTask} />}/>
        <Route path="/my-tasks" component={() => <h1>My Tasks</h1>}/>
        <Redirect from="/" to="/explore"/>
      </Switch>
    )
  }  
  
}

const mapStateToProps = state => ({  
  tasks: state.tasks.tasks  
})
  
export default withRouter(connect(mapStateToProps)(TaskScreenContainer))
