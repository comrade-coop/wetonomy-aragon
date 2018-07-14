import React from 'react'
import { SidePanel } from '@aragon/ui'
import PropTypes from 'prop-types'

import NewMemberForm from './NewMemberForm'

class NewMemberPanel extends React.Component {
  render() {
    return (
      <SidePanel title="Add a new Member" opened={this.props.opened} onClose={this.props.onClose}>
        <NewMemberForm onClose={this.props.onClose} />
      </SidePanel>
    )
  }
}

NewMemberPanel.propTypes = {
  opened: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}

export default NewMemberPanel