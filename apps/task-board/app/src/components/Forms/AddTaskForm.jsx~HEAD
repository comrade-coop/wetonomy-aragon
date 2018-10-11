import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import BaseTaskForm from './BaseTaskForm'

const initialState = {
  id: -1,
  workField: 0,
  heading: '',
  description: '',
  project: 0,
  tags: [],
  tag: '',
  column: 0,
  tokens: 0,
  originalTokens: 0,
  difficulty: 0,
  error: null,
}

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
    }
  }

  render() {
    console.log(this.props)
    return (
      <BaseTaskForm
        issuer = {this.props.currentUser}
        delete = {false}
        onAddTask={this.props.onAddTask}
        onClose={this.props.onClose}
        state = {this.state}
      />
    )
  }
}

AddTaskForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired
}
const mapStateToProps = state => ({
  currentUser: state.tasks.currentUser
})
export default connect(mapStateToProps)(AddTaskForm)