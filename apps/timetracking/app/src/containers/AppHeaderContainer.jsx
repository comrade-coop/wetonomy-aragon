import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { AppBar, } from '@aragon/ui'
import styled from 'styled-components'
import { APP_NAME } from '../utils/appConstants'
import MemberProfile from '../components/Top/MemberProfile'

class AppHeaderContainer extends Component {

  getEndContent = () => (
    <EndContent>
      <MemberProfile
        debt={this.props.debtTokens}
        rewardTokens={this.props.rewardTokens}
        member={this.props.currentMember} />
    </EndContent>
  )

  render() {
    return ( <AppBar title={APP_NAME} endContent={this.getEndContent()} />)
  }
}
AppHeaderContainer.propTypes = {
  debtTokens: PropTypes.number.isRequired,
  rewardTokens: PropTypes.number.isRequired,
  currentMember: PropTypes.string.isRequired
}

const EndContent = styled.div`
  display: flex;
`

const mapStateToProps = state => ({
  debtTokens: state.tracks.userTokens.debt,
  rewardTokens: state.tracks.userTokens.reward,
  currentMember: state.tracks.currentUser
})

export default withRouter(connect(mapStateToProps)(AppHeaderContainer))