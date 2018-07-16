import React from 'react'
import PropTypes from 'prop-types'
import BaseTrackForm from "./BaseTrackForm"
import TrackedHour from '../../models/TrackedHour'
const initialState = {
  id: 0,
  description: '',
  project: 0,
  hours: 0,
  minutes: 0,
  error: null,
}

class TrackForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState,
    }
  }

  render() {
    return (
      <BaseTrackForm 
        delete = {false} 
        handleTrackHour={this.props.handleTrackHour}
        day = { this.props.day }
        onClose={this.props.onClose}
        state = {this.state}
      />
    )
  }
}

TrackForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default TrackForm