import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import TrackPanel from '../components/TrackPanel'
import { closeAndReset } from '../actions/panel'
import TrackedHour from '../models/TrackedHour'
import { updateWork, trackWork, deleteWork } from '../actions/tracks'

class PanelContainer extends Component {

  handleTrackHour = (trackedHour) => {
    if (trackedHour instanceof TrackedHour) {
      console.log(trackedHour)
      const { dispatch } = this.props
      dispatch(trackWork(trackedHour))
    } else {
      console.error('passed parameter TrackedHour should be of type TrackedHour')
    }
    this.handleClose()
  }

  handleUpdateHour = (trackedHour) => {
    if (trackedHour instanceof TrackedHour) {
      console.log(trackedHour)
      const { dispatch } = this.props
      dispatch(updateWork(trackedHour))
    } else {
      console.error('passed parameter TrackedHour should be of type TrackedHour')
    }
    this.handleClose()
  }  

  handleDeleteHour = () => {
    const trackedHour = this.props.selectedWork
    if (trackedHour instanceof TrackedHour) {
      console.log(trackedHour)
      const { dispatch } = this.props
      dispatch(deleteWork(trackedHour))
    } else {
      console.error('passed parameter TrackedHour should be of type TrackedHour')
    }
    this.handleClose()
  }

  handleClose = () => {
    const { dispatch } = this.props
    dispatch(closeAndReset())
  }

  render() {
    const { opened, mode, selectedWork, selectedDay } = this.props
    return (
      <TrackPanel
        mode={mode}
        opened={opened}
        selectedWork = {selectedWork}
        selectedDay = {selectedDay}
        onTrackHour={this.handleTrackHour}
        onUpdateHour={this.handleUpdateHour}
        onDeleteHour={this.handleDeleteHour}
        onClose={this.handleClose} />
    )
  }
}

PanelContainer.propTypes = {
  opened: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  selectedWork: PropTypes.instanceOf(TrackedHour),
  selectedDay: PropTypes.instanceOf(Date)
}

const mapStateToProps = state => ({
  opened: state.panel.opened,
  mode: state.panel.mode,
  selectedWork: state.tracks.selectedWork,
  selectedDay: state.tracks.selectedDay
})

export default connect(mapStateToProps)(PanelContainer)
