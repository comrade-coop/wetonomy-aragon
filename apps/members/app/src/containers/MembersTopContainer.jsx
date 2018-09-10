import React, { Component } from 'react'
import {connect} from 'react-redux'

import MembersTop from '../components/MembersTop'
import { addMember } from '../actions/panel'

class MembersTopContainer extends Component {

  handleNewMember = () => {
    const { dispatch } = this.props
    dispatch(addMember())
  }

  render() {
    return (
      <MembersTop 
        members={this.props.members} 
        onNewMemberClick={this.handleNewMember} />
    )
  }  
}

const mapStateToProps = state => ({  
  members: state.members.members  
})

export default connect(mapStateToProps)(MembersTopContainer)
