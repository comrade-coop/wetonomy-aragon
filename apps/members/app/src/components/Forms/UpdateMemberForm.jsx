import React from 'react'
import PropTypes from 'prop-types'
import MemberFormBase from './MemberFormBase'

import { UPDATE_MEMBER_FORM_BTN_LABEL } from '../../utils/appConstants'

class UpdateMemberForm extends React.Component {
  static propTypes = {
    onUpdateMember: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    member: PropTypes.object.isRequired
  }

  handleSubmitMember = (newMember) => {
    const oldMember = this.props.member
    this.props.onUpdateMember(oldMember, newMember)
  }

  render() {
    return (
      <MemberFormBase
        onSubmitMember={this.handleSubmitMember}
        onCancel={this.props.onCancel}
        submitBtnText={UPDATE_MEMBER_FORM_BTN_LABEL}
        name={this.props.member.name}
        address={this.props.member.address}
        level={this.props.member.level} />
    )
  }
}

export default UpdateMemberForm