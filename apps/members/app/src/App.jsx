import React from 'react'
import { AragonApp, observe } from '@aragon/ui'
import PropTypes from 'prop-types'

import './utils/globalStyle'
import AppHeader from './components/AppHeader'
import Main from './screens/Main'
import NewMemberPanel from './components/NewMemberPanel'
import NoMembers from './screens/NoMembers'
import Member from './models/Member'

class App extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired
  }

  static defaultProps = {
    organizationName: '',
    members: [],
    memberDebt: 0,
    rewardTokens: 0    
  }

  state = {
    isNewMemberPanelOpened: false
  }

  handleNewMemberPanelToggle = () => {
    this.setState({
      isNewMemberPanelOpened: !this.state.isNewMemberPanelOpened
    })
  }

  handleAddMember = (member) => {
    if (member instanceof Member) {
      this.props.app.addMember(member.address, member.name, member.level)
    } else {
      console.error('passed parameter member should be of type Member')
    }
    
    this.handleNewMemberPanelToggle()
  }  

  handleRemoveMember = (member) => {
    if (member instanceof Member) {
      this.props.app.removeMember(member.id)
    } else {
      console.error('passed parameter member should be of type Member')
    }

    this.handleNewMemberPanelToggle()
  }

  render() {
    return (
      <AragonApp>
        <AppHeader
          memberDebt={this.props.memberDebt}
          rewardTokens={this.props.rewardTokens}/>

        {this.props.members.length > 0 ? 
          <Main
            organizationName={this.props.organizationName}
            members={this.props.members}
            onNewMemberClick={this.handleNewMemberPanelToggle} /> :
          <NoMembers onNewMemberClick={this.handleNewMemberPanelToggle} />
        }
        

        <NewMemberPanel
          onAddMember={this.handleAddMember}
          opened={this.state.isNewMemberPanelOpened}
          onClose={this.handleNewMemberPanelToggle}/>
      </AragonApp>
    )
  }
}

export default observe(
  observable => observable.map(state => ({ ...state })),
  {}
)(App)
