import React from 'react'
import { SidePanel } from '@aragon/ui'
import PropTypes from 'prop-types'
import TrackForm from './Forms/TrackForm'
import EditTrackForm from './Forms/EditTrackForm'
import { PanelMode } from '../utils/appConstants'
import TrackedHour from '../models/TrackedHour'

const getPanelContent = (props) => {
  switch (props.mode) {      
    case PanelMode.ADD: {
      return (
        <TrackForm
          selectedDay = {props.selectedDay}
          onClose={props.onClose}            
          onTrackHour={props.onTrackHour}  />
      )
    }
    case PanelMode.EDIT: {
      return (
        <EditTrackForm 
          selectedDay = {props.selectedDay}
          selectedWork = {props.selectedWork}
          onClose={props.onClose}
          onDeleteHour = {props.onDeleteHour}
          onTrackHour={props.onUpdateHour} />
      )
    }
    default: {
      return (
        <div id="new"></div>
      )
    }
  }
}

export const TrackPanel = (props) => {
  return (
    <SidePanel
      title={props.mode}
      opened={props.opened}
      onClose={props.onClose}>
      {getPanelContent(props)}
    </SidePanel>
  )
  
}

TrackPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  selectedWork: PropTypes.instanceOf(TrackedHour),
  selectedDay: PropTypes.instanceOf(Date),
  onClose: PropTypes.func.isRequired,
  onTrackHour: PropTypes.func.isRequired,
  onUpdateHour: PropTypes.func.isRequired,
  onDeleteHour: PropTypes.func.isRequired,
}

export default TrackPanel