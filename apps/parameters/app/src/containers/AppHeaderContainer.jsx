import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AppHeader from '../components/Top/AppHeader'
import NavBar from '../components/Top/NavBar'

class AppHeaderContainer extends Component {
  render() {
    const appHeader = <AppHeader
      rewardTokens={this.props.rewardTokens}
      debtTokens={this.props.debtTokens}
      currentMember={this.props.currentMember}/>
    return (
      <NavBar AppBar={ appHeader }  />
    )
  }
}


const mapStateToProps = state => ({
  debtTokens: state.parameters.userTokens.debt,
  rewardTokens: state.parameters.userTokens.reward,
  currentMember: state.parameters.currentUser
})

export default withRouter(connect(mapStateToProps)(AppHeaderContainer))