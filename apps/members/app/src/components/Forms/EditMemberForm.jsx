import React from 'react'
import PropTypes from 'prop-types'
import MemberFormBase from './MemberFormBase'

class EditMemberForm extends React.Component {
  static propTypes = {
    onEditMember: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    member: PropTypes.object.isRequired
  }

  handleSubmitMember = (newMember) => {
    const oldMember = this.props.member
    this.props.onEditMember(oldMember, newMember)
  }

  render() {
    const { name, address, level } = this.props.member
    return (
      <MemberFormBase
        onSubmitMember={this.handleSubmitMember}
        onClose={this.props.onClose}
        submitBtnText={'Save Changes'}
        name={name}
        address={address}
        level={level} />
    )
  }
}

export default EditMemberForm