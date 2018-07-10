import React from 'react'
import ReactDOM from 'react-dom'
import Aragon, { providers } from '@aragon/client'
import App from './App'

import IPFSActions from './actions/IPFSActions'
import DBStore from './stores/DBStore'

class ConnectedApp extends React.Component {
  state = {
    app: new Aragon(new providers.WindowMessage(window.parent)),
    observable: null,
    userAccount: '',
  }

  componentDidMount() {
    window.addEventListener('message', this.handleWrapperMessage)

    IPFSActions.start()
    DBStore.init()
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWrapperMessage)
  }

  handleWrapperMessage = ({ data }) => {
    if (data.from !== 'wrapper') {
      return
    }

    if (data.name === 'ready') {
      const { app } = this.state
      this.sendMessageToWrapper('ready', true)
      this.setState({
        observable: app.state(),
      })

      app.accounts().subscribe(accounts => {
        this.setState({
          userAccount: accounts[0],
        })
      })

      console.log('SHOSHSOHSOHSOSHOSHOS')
      IPFSActions.start(this.state.userAccount)
      //IPFSActions.start()
    }
  }

  sendMessageToWrapper = (name, value) => {
    window.parent.postMessage({ from: 'app', name, value }, '*')
  }

  render() {
    return <App {...this.state} />
  }
}

ReactDOM.render(
  <ConnectedApp />, document.getElementById('root'))
