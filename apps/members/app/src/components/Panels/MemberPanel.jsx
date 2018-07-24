import React from 'react'
import PropTypes from 'prop-types'
import {SidePanel} from '@aragon/ui'
import AddMemberForm from '../Forms/AddMemberForm'
import EditMemberForm from '../Forms/EditMemberForm'
import RemoveMemberForm from '../Forms/RemoveMemberForm'
import Member from '../../models/Member'

export const PanelMode = {
  ADD: 0,
  EDIT: 1,
  REMOVE: 2
}

class MemberPanel extends React.Component {
  static propTypes = {
    opened: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    mode: PropTypes.number.isRequired,
    onAddMember: PropTypes.func.isRequired,
    onEditMember: PropTypes.func.isRequired,
    onRemoveMember: PropTypes.func.isRequired,
    selectedMember: PropTypes.object
  }

  _getPanelContent = () => {
    switch (this.props.mode) {      
      case PanelMode.EDIT: {
        const member = Member.wrap(this.props.selectedMember)
        return (
          <EditMemberForm
            member={member}
            onClose={this.props.onClose}            
            onEditMember={this.props.onEditMember} />
        )
      }
      case PanelMode.REMOVE: {
        const member = Member.wrap(this.props.selectedMember)
        return (
          <RemoveMemberForm
            member={member}
            onClose={this.props.onClose}
            onRemoveMember={this.props.onRemoveMember}/>
        )
      }
      case PanelMode.ADD:
      default: {
        return (
          <AddMemberForm
            onClose={this.props.onClose}
            onAddMember={this.props.onAddMember}/>
        )
      }
    }
  }

  _getTitle = () => {
    switch (this.props.mode) {      
      case PanelMode.EDIT:
        return 'Edit Member'
      case PanelMode.REMOVE:
        return 'Remove Member'
      case PanelMode.ADD:
      default:
        return 'Add a new Member'
    }
  }

  render() {
    return (
      <SidePanel
        title={this._getTitle()}
        opened={this.props.opened}
        onClose={this.props.onClose}>
        {this._getPanelContent()}
      </SidePanel>
    )
  }
}

export default MemberPanel
