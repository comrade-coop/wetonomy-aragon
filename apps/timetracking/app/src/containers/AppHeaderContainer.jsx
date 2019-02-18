import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
AppHeaderContainer.propTypes = {
  debtTokens: PropTypes.number.isRequired,
  rewardTokens: PropTypes.number.isRequired,
  currentMember: PropTypes.string.isRequired
}

const mapStateToProps = state => ({
  debtTokens: state.tracks.userTokens.debt,
  rewardTokens: state.tracks.userTokens.reward,
  currentMember: state.tracks.currentUser
})

export default withRouter(connect(mapStateToProps)(AppHeaderContainer))