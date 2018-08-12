import React from 'react'
import { AragonApp, observe } from '@aragon/ui'
import PropTypes from 'prop-types'

import './utils/globalStyle'
import MembersScreen from './screens/MembersScreen'
import NoMembersScreen from './screens/NoMembersScreen'
import AppHeader from './components/AppHeader'
import MemberPanel, { PanelMode } from './components/Panels/MemberPanel'

import { isValidMember } from './models/Member'

class App extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,    
    members: PropTypes.array.isRequired,
    currentMember: PropTypes.object,
    memberDebt: PropTypes.number,
    rewardTokens: PropTypes.number,
    organizationName: PropTypes.string
  }

  static defaultProps = {
    app: null,
    // members: [ new Member('Pesho', '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7', 2, 1) ],
    members: [],
    currentMember: null,
    memberDebt: 0,
    rewardTokens: 0,
    organizationName: ''
  }

  state = {
    isPanelOpened: false,
    panelMode: PanelMode.ADD
  }

  handlePanelToggle = (mode = PanelMode.ADD) => {
    this.setState({
      panelMode: mode,
      isPanelOpened: !this.state.isPanelOpened
    })
  }

  handleAddMember = (member) => {    
    console.log(member)
    if (isValidMember(member)) {
      this.props.app.addMember(member.address, member.name, member.level)  
    }   
  }

  handleEditMember = (oldMember, newMember) => {
    if (isValidMember(oldMember) && isValidMember(newMember)) {
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
  }

  handleRemoveMember = (member) => {
    if (isValidMember(member)) {
      this.props.app.removeMember(member.id)      
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
          rewardTokens={this.props.rewardTokens}
          currentMember={this.props.currentMember} />

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
          onClose={this.handlePanelToggle} />
      </AragonApp>
    )
  }
}

export default observe(
  observable => observable.map(state => ({ ...state })),
  {}
)(App)
