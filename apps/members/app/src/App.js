import React from 'react'
import { getOrganizationName, getMembers, getMemberDebt, getRewardTokens } from './dummyDataProvider'
import { AragonApp } from '@aragon/ui'
import AppHeader from './components/AppHeader'
import Main from './components/Main'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      organizationName: '',
      members: [],
      memberDebt: 0,
      rewardTokens: 0
    }
  }

  componentWillMount() {
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

  render() {
    return (
      <AragonApp>
        <AppHeader
          memberDebt={this.state.memberDebt}
          rewardTokens={this.state.rewardTokens} />
        <Main
          organizationName={this.state.organizationName}
          members={this.state.members} />
      </AragonApp>
    )
  }
}

export default App
