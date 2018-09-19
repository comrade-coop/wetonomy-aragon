import React, { Component } from 'react'
import { connect } from 'react-redux'
import MembersTable from '../components/Tables/MembersTable'
import { editMember, removeMember } from '../actions/panel'

class MembersTableContainer extends Component {

  handleMemberEdit = (member) => {
    const { dispatch } = this.props
    dispatch(editMember(member))
  }

  handleMemberRemove = (member) => {
    const { dispatch } = this.props
    dispatch(removeMember(member))
  }

  render() {
    return (
      <MembersTable 
        members={this.props.members}
        onEditMemberClick={this.handleMemberEdit}
        onRemoveMemberClick={this.handleMemberRemove} />
    )
  }
}

const mapStateToProps = state => ({
  members: state.members.members
})

export default connect(mapStateToProps)(MembersTableContainer)