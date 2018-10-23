import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AppHeader from '../components/Top/AppHeader'

class AppHeaderContainer extends Component {

  render() {
    return (
      <AppHeader
        rewardTokens={this.props.rewardTokens}
        currentMember={this.props.currentMember}
        onNewTask={this.handleNewTask} />
    )
  }
}


const mapStateToProps = state => ({
  rewardTokens: state.parameters.userTokens.reward,
  currentMember: state.parameters.currentUser
})

export default withRouter(connect(mapStateToProps)(AppHeaderContainer))