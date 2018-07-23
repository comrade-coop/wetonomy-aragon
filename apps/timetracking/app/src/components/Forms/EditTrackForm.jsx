import React from 'react'
import PropTypes from 'prop-types'
import BaseTrackForm from "./BaseTrackForm"
import TrackedHour from '../../models/TrackedHour'
import {PROJCETS} from '../../utils/dummyDataProvider'

class EditTrackForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.selectedTrack._id,
      description: this.props.selectedTrack._description,
      project: PROJCETS.indexOf(this.props.selectedTrack._project),
      hours: this.props.selectedTrack._hours,
      minutes: this.props.selectedTrack._minutes || 0,
      error: null
    }
  }

  render() {
    return (
			<BaseTrackForm 
				delete = {true}
				handleTrackHour={this.props.handleTrackHour}
				handleDeleteTrackHour = {this.props.handleDeleteTrackHour}
        day = {new Date (this.props.selectedTrack._date).getDate()}
        onClose={this.props.onClose}
        state = {this.state}
      />
    )
  }
}

EditTrackForm.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default EditTrackForm