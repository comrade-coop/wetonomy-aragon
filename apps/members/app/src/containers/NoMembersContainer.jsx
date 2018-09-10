import React, { Component } from 'react'
import NoMembers from '../components/NoMembers'
import { connect } from 'react-redux'

import { addMember } from '../actions/panel'

class NoMembersContainer extends Component {

  handleAddMemberClick = () => {
    const { dispatch } = this.props
    dispatch(addMember())
  }

  render() {
    return <NoMembers onNewMemberClick={this.handleAddMemberClick} />
  }
}

export default connect()(NoMembersContainer)
