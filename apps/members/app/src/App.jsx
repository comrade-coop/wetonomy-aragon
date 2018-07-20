import React from 'react'
import { AragonApp, observe } from '@aragon/ui'
import PropTypes from 'prop-types'

import './utils/globalStyle'
import MembersScreen from './screens/MembersScreen'
import NoMembersScreen from './screens/NoMembersScreen'
import AppHeader from './components/AppHeader'
import MemberPanel, { PanelMode } from './components/Panels/MemberPanel'

import Member from './models/Member'

class App extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired
  }

  static defaultProps = {
    organizationName: '',
    // members: [ new Member('Pesho', '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7', 2, 1) ],
    members: [],
    memberDebt: 0,
    rewardTokens: 0
  }

  state = {
    isPanelOpened: false,
    panelMode: PanelMode.ADD
  }

  handlePanelToggle = (mode = PanelMode.ADD) => {
    this.setState({
      panelMode: mode
    })

    this.setState({
      isPanelOpened: !this.state.isPanelOpened,      
    })
  }

  handleAddMember = (member) => {
    if (member instanceof Member) {
      this.props.app.addMember(member.address, member.name, member.level)
    } else {
      console.error('Expected parameter of type Member but got:', member)
    }
    
  }

  handleEditMember = (oldMember, newMember) => {
    if (!(oldMember instanceof Member)) {
      console.error('Expected parameter of type Member but got:', oldMember)
      return
    }

    if (!(newMember instanceof Member)) {
      console.error('Expected parameter of type Member but got:', newMember)
      return
    }    
    
    const memberId = oldMember.id
    if (oldMember.name !== newMember.name ||
      oldMember.address !== newMember.address ||
      oldMember.level !== newMember.level) {
      this.props.app.updateMember(
        memberId,
        newMember.address,
        newMember.name,
        newMember.level  
      )
    }  
  }

  handleRemoveMember = (member) => {
    if (member instanceof Member) {
      this.props.app.removeMember(member.id)    
    } else {
      console.error('Expected parameter of type Member but got:', member)
    }
  }

  handleMemberSelect = (selectedMember) => {
    this.setState({ selectedMember })
  }

  render() {
    return (
      <AragonApp>
        <AppHeader
          memberDebt={this.props.memberDebt}
          rewardTokens={this.props.rewardTokens}/>

        {this.props.members.length > 0 ? 
          <MembersScreen
            organizationName={this.props.organizationName}
            members={this.props.members}
            onNewMemberClick={() => this.handlePanelToggle(PanelMode.ADD)}
            onEditMemberClick={() => this.handlePanelToggle(PanelMode.EDIT)}
            onRemoveMemberClick={() => this.handlePanelToggle(PanelMode.REMOVE)}
            onMemberSelect={this.handleMemberSelect} /> :
          <NoMembersScreen onNewMemberClick={() => this.handlePanelToggle(PanelMode.ADD)} />
        }

        <MemberPanel
          onAddMember={this.handleAddMember}
          onEditMember={this.handleEditMember}
          onRemoveMember={this.handleRemoveMember}
          opened={this.state.isPanelOpened}
          mode={this.state.panelMode}
          selectedMember={this.state.selectedMember}
          onClose={(mode) => this.handlePanelToggle(mode)} />
      </AragonApp>
    )
  }
}

export default observe(
  observable => observable.map(state => ({ ...state })),
  {}
)(App)
