import React from 'react'
import { getOrganizationName, getMembers } from './dummyDataProvider'
import {AragonApp} from '@aragon/ui'
import Header from './components/Header'
import Main from './components/Main'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      organizationName: '',
      members: []
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
  }

  render() {
    return (
      <AragonApp>
        <Header />
        <Main organizationName={this.state.organizationName} 
          members={this.state.members} />
      </AragonApp>
    )
  }
}

export default App
