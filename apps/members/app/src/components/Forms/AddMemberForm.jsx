import React from 'react'
import PropTypes from 'prop-types'
import MemberFormBase from './MemberFormBase'

class AddMemberForm extends React.Component {
  static propTypes = {
    onAddMember: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  render() {
    return (
      <MemberFormBase
        onSubmitMember={this.props.onAddMember}
        onClose={this.props.onClose}
        submitBtnText={'Add'} />
    )
  }
}

export default AddMemberForm