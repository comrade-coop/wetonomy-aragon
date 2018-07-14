import React from 'react'
import { AragonApp } from '@aragon/ui'

import './utils/globalStyle'
import AppHeader from './components/AppHeader'
import Main from './screens/Main'
import NewMemberPanel from './components/NewMemberPanel'
import { getOrganizationName, getMembers, getMemberDebt, getRewardTokens } from './utils/dummyDataProvider'

const initialState = {
  organizationName: '',
  members: [],
  memberDebt: 0,
  rewardTokens: 0,
  isNewMemberPanelOpened: false
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      ...initialState
    }
  }

  componentWillMount() {
    this.loadDummyData()
  }

  loadDummyData() {
    getOrganizationName().then(organizationName => {
      this.setState({ organizationName })
    }).catch(err => {
      console.error('Failed to fetch organization name', err)
    })

    getMembers().then(members => {
      this.setState({ members })
    }).catch(err => {
      console.error('Failed to fetch organization name', err)
    })

    getMemberDebt().then(memberDebt => {
      this.setState({ memberDebt })
    }).catch(err => {
      console.error('Failed to fetch member debt', err)
    })
    
    getRewardTokens().then(rewardTokens => {
      this.setState({ rewardTokens })
    }).catch(err => {
      console.error('Failed to fetch reward tokens', err)
    })
  }

  handleNewMemberPanelToggle = () => {
    this.setState({ isNewMemberPanelOpened: !this.state.isNewMemberPanelOpened })
  }

  render() {
    return (
      <AragonApp>
        <AppHeader
          memberDebt={this.state.memberDebt}
          rewardTokens={this.state.rewardTokens} />

        <Main
          organizationName={this.state.organizationName}
          members={this.state.members}
          onNewMemberClick={this.handleNewMemberPanelToggle} />

        <NewMemberPanel 
          opened={this.state.isNewMemberPanelOpened}
          onClose={this.handleNewMemberPanelToggle} />
      </AragonApp>
    )
  }
}

export default App
