import React, { Component } from 'react'
import {connect} from 'react-redux'

import MemberPanel from '../components/Panels/MemberPanel'
import { togglePanel } from '../actions/panel'
import { addMember, updateMember, removeMember } from '../actions/members'

export const PanelMode = {
  ADD: 'Add a new member',
  EDIT: 'Edit member',
  REMOVE: 'Remove member'
}

class MemberPanelContainer extends Component {

  handleAddMember = member => {
    const { dispatch } = this.props
    dispatch(addMember(member))
  }

  handleUpdateMember = (oldMember, newMember) => {
    const { dispatch } = this.props
    dispatch(updateMember(oldMember, newMember))
  }

  handleRemoveMember = member => {
    const { dispatch } = this.props
    dispatch(removeMember(member))
  }

  handleClose = () => {
    const { dispatch } = this.props
    dispatch(togglePanel())
  }

  render () {
    const { opened, mode, selectedMember } = this.props

    return (
      <MemberPanel
        opened={opened}
        mode={mode}
        selectedMember={selectedMember}
        onAddMember={this.handleAddMember}
        onUpdateMember={this.handleUpdateMember}
        onRemoveMember={this.handleRemoveMember}
        onClose={this.handleClose} />
    )  
  }
}

const mapStateToProps = state => ({
  opened: state.panel.opened,
  mode: state.panel.mode,
  selectedMember: state.panel.selectedMember
})

export default connect(mapStateToProps)(MemberPanelContainer)
