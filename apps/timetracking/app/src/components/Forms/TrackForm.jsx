import React from 'react'
import PropTypes from 'prop-types'
import BaseTrackForm from './BaseTrackForm'

export const TrackForm = (props) => {
  const initialState = {
    id: 0,
    description: '',
    project: 0,
    hours: 0,
    minutes: 0,
    error: null,
  }
  return (
    <BaseTrackForm 
      delete = {false} 
      onTrackHour={props.onTrackHour}
      day = { props.selectedDay }
      onClose={props.onClose}
      state = {initialState}
    />
  )
  
}

TrackForm.propTypes = {
  selectedDay: PropTypes.instanceOf(Date),
  onClose: PropTypes.func.isRequired,
  onTrackHour: PropTypes.func.isRequired
}

export default TrackForm