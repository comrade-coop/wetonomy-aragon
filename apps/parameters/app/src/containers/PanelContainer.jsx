import React, { Component } from 'react'
import { connect } from 'react-redux'
import ParametersPanel from '../components/Panels/ParametersPanel'
import { closeAndReset } from '../actions/panel'
import { parameterChange } from '../actions/parameters'

class PanelContainer extends Component {
  
  handleParameterChange = (type, parameter) => {
    console.log(type)
    const { dispatch } = this.props
    dispatch(parameterChange(type, parameter))
    this.handleClose()
  }

  handleClose = () => {
    const { dispatch } = this.props
    dispatch(closeAndReset())
  }

  render() {
    const { opened, mode } = this.props

    return (
      <ParametersPanel
        opened={opened}
        mode={mode}
        onParameterChange={this.handleParameterChange}
        onClose={this.handleClose} />
    )
  }
}

const mapStateToProps = state => ({
  opened: state.panel.opened,
  mode: state.panel.mode,
  selectedTask: state.panel.selectedTask,
  membersAddress: state.parameters.members,
  timeTrackingAddress: state.parameters.timeTracking,
  tokenManagerAddress: state.parameters.tokenManager
})

export default connect(mapStateToProps)(PanelContainer)
