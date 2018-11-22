import React, { Component } from 'react'
import { connect } from 'react-redux'

import AppHeader from '../components/AppHeader'
import NavBar from '../components/AppHeader/NavBar'

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
  // debtTokens: state.parameters.userTokens.debt,
  // rewardTokens: state.parameters.userTokens.reward,
  currentMember: state.members.currentMember
})

export default connect(mapStateToProps)(AppHeaderContainer)