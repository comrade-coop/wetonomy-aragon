import React from 'react'
import PropTypes from 'prop-types'

import {SidePanel} from '@aragon/ui'
import AddMemberForm from '../Forms/AddMemberForm'
import UpdateMemberForm from '../Forms/UpdateMemberForm'
import RemoveMemberForm from '../Forms/RemoveMemberForm'

export const PanelMode = {
  ADD: 'Add a new member',
  EDIT: 'Edit member',
  REMOVE: 'Remove member'
}

const _getPanelContent = (mode, onAddMember, onUpdateMember, onRemoveMember, onCancel, member = null) => {
  switch (mode) {      
    case PanelMode.EDIT: {
      return (
        <UpdateMemberForm
          member={member}
          onUpdateMember={onUpdateMember}
          onCancel={onCancel} />
      )
    }
    case PanelMode.REMOVE: {
      return (
        <RemoveMemberForm 
          member={member}
          onRemoveMember={onRemoveMember}
          onCancel={onCancel} />
      )
    }
    case PanelMode.ADD:
    default: {
      return (
        <AddMemberForm 
          onAddMember={onAddMember}
          onCancel={onCancel} />
      )
    }
  }
}

const MemberPanel = ({ mode, opened, onAddMember, onUpdateMember, onRemoveMember, onClose, selectedMember }) => (
  <SidePanel
    title={mode}
    opened={opened}
    onClose={onClose}>
    {_getPanelContent(mode, onAddMember, onUpdateMember, onRemoveMember, onClose, selectedMember)}
  </SidePanel>
)

MemberPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  selectedMember: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    level: PropTypes.object.isRequired
  }),
  onUpdateMember: PropTypes.func.isRequired,
  onRemoveMember: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddMember: PropTypes.func.isRequired
}

export default MemberPanel
