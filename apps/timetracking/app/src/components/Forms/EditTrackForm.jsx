import React from 'react'
import PropTypes from 'prop-types'
import BaseTrackForm from './BaseTrackForm'
import {PROJECTS} from '../../utils/dummyDataProvider'
import TrackedHour from '../../models/TrackedHour'
import { WORK_MINUTES } from '../../utils/appConstants'

export const EditTrackForm = (props) => {
  const minutes = parseInt(Math.round((props.selectedWork.hours - parseInt(props.selectedWork.hours))*100)) || 0
  const state = {
    id: props.selectedWork.id,
    description: props.selectedWork.description,
    project: PROJECTS.indexOf(props.selectedWork.project),
    hours: parseInt(props.selectedWork.hours),
    minutes: WORK_MINUTES.indexOf(minutes),
    error: null
  }
  
  return (
    <BaseTrackForm 
      delete = {true}
      day = {props.selectedDay}
      onTrackHour={props.onTrackHour}
      onDeleteHour = {props.onDeleteHour}
      onClose={props.onClose}
      state = {state}
    />
  )
  
}

EditTrackForm.propTypes = {
  selectedWork: PropTypes.instanceOf(TrackedHour),
  selectedDay: PropTypes.instanceOf(Date),
  onClose: PropTypes.func.isRequired,
  onTrackHour: PropTypes.func.isRequired,
  onDeleteHour: PropTypes.func.isRequired,
}

export default EditTrackForm