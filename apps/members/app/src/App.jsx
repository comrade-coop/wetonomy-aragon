import React from 'react'
import { AragonApp } from '@aragon/ui'
import { connect } from 'react-redux'

import './utils/globalStyle'
import MembersMain from './components/MembersMain'
import NoMembersContainer from './containers/NoMembersContainer'
import AppHeader from './components/AppHeader'
import MemberPanelContainer from './containers/MemberPanelContainer'

class App extends React.Component {

  renderMainContent() {
    const { members } = this.props
    return (members.length > 0) ? <MembersMain /> : <NoMembersContainer />
  }

  render() {
    return (
      <AragonApp>
        <AppHeader currentMember={this.props.currentMember} />
        {this.renderMainContent()}
        <MemberPanelContainer />
      </AragonApp>
    )
  }
}

const mapStateToProps = state => ({
  members: state.members.members,
  currentMember: state.members.currentMember
})

export default connect(mapStateToProps)(App)
