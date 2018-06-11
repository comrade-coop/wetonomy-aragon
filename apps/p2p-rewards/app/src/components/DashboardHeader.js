import React from 'react'
import styled from 'styled-components'
import { Card, TextInput, Field, Button } from '@aragon/ui'

const CardFullWidth = styled(Card)`  
  height: auto;
  padding: 30px 40px; 
  width: 100%;
`

const TextInputLarge = styled(TextInput)`
  width: 50%;
  min-width: 300px;
`

const RewardsContainer = styled.div`
  
`

class DashboardHeader extends React.Component {
  render() {
    return (
      <CardFullWidth>
        <Title>You have {this.props.tokenCount} more tokens to give this month.</Title>
        <Field label="Enter Recipient">
          <TextInputLarge type="text" />
        </Field> 

        <Field label="Enter reason">
          <TextInputLarge wide />
        </Field>

        <Field label="Enter Amount">
          <TextInputLarge.Number />
        </Field>

        <RewardBtn mode="strong">Give Reward</RewardBtn>

        <RewardsContainer />
          
      </CardFullWidth>
    )
  }
}

const RewardBtn = styled(Button)`
  
`

const Title = styled.h1`
  font-size: 2em;
`

export default DashboardHeader