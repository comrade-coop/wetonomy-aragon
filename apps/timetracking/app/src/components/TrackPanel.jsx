import React from 'react'
import { SidePanel } from '@aragon/ui'
import PropTypes from 'prop-types'

import TrackForm from './Forms/TrackForm'
import EditTrackForm from './Forms/EditTrackForm'
export const PanelMode = {
  BASE: 0,
  ADD: 1,
  EDIT: 2,
}
class TrackPanel extends React.Component {
  getPanelContent = () => {
    switch (this.props.mode) {      
      case PanelMode.ADD: {
        return (
          <TrackForm
            day = {this.props.selectedTrack}
            onClose={this.props.onClose}            
            handleTrackHour={this.props.handleTrackHour}  />
        )
      }
      case PanelMode.EDIT: {
        return (
          <EditTrackForm 
            selectedTrack = {this.props.selectedTrack}
            onClose={this.props.onClose}
            handleDeleteTrackHour = {this.props.handleDeleteTrackHour}
            handleTrackHour={this.props.handleTrackHour} />
        )
      }
      default: {
        return (
          <div id="new"></div>
        )
      }
    }
  }
  getTitle = () => {
    switch (this.props.mode) {      
      case PanelMode.EDIT:
        return 'Edit Work Hours'
      case PanelMode.ADD:
      default:
        return 'Track Work Hours'
    }
  }
  render() {
    return (
      <SidePanel
        title={this.getTitle()}
        opened={this.props.opened}
        onClose={this.props.onClose}>
        {this.getPanelContent()}
      </SidePanel>
    )
  }
}

TrackPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default TrackPanel