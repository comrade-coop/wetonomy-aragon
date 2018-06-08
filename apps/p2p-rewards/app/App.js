import React from 'react'
import {AragonApp, Button, Text, observe} from '@aragon/ui'
import Aragon, {providers} from '@aragon/client'
import styled from 'styled-components'

const AppContainer = styled(AragonApp)`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default class App extends React.Component {
  render() {
    return (
      <AppContainer>
        <div>
          <Button>Press me!</Button>
          <Text>P2P Rewards</Text>
        </div>
      </AppContainer>
    )
  }
}

const ObservedCount = observe((state$) => state$, {count: 0})(({count}) => <Text.Block style={{
  textAlign: 'center'
}} size='xxlarge'>{count}</Text.Block>)
