import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toggleWindow } from '../actions/activities'

import AppHeader from '../components/Top/AppHeader'

class AppHeaderContainer extends Component {

  handleActivityClick = () => {
    const { dispatch } = this.props
    dispatch(toggleWindow())
  }

  handleOutsideClick = () => {
    if (this.props.opened) {
      const { dispatch } = this.props
      dispatch(toggleWindow())
    }
  }

  render() {
    return (
      <AppHeader
        rewardTokens={this.props.userTokens.reward}
        daoTokens={this.props.userTokens.dao}
        currentMember={this.props.currentMember}
        opened={this.props.opened}
        onNewTask={this.handleNewTask}
        onOutsideClick={this.handleOutsideClick}
        onActivityClick={this.handleActivityClick} />
    )
  }
}


const mapStateToProps = state => ({
  userTokens: state.tasks.userTokens,
  currentMember: state.tasks.currentUser,
  opened: state.activities.opened
})

export default withRouter(connect(mapStateToProps)(AppHeaderContainer))