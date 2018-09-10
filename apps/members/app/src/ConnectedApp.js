import React from 'react'
import { connect } from 'react-redux'
import App from './App'
import { loadFullState } from './actions/members'

class ConnectedApp extends React.Component {
  componentDidMount() {
    window.addEventListener('message', this.handleWrapperMessage)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleWrapperMessage)
  }

  handleWrapperMessage = ({ data }) => {
    if (data.from !== 'wrapper') {
      return
    }
    
    if (data.name === 'ready') {
      this.sendMessageToWrapper('ready', true)
      const { dispatch } = this.props
      dispatch(loadFullState(window.parent))
    }
  } 

  sendMessageToWrapper = (name, value) => {
    window.parent.postMessage({ from: 'app', name, value }, '*')
  }

  render() {
    return <App />
  }
}

export default connect()(ConnectedApp)