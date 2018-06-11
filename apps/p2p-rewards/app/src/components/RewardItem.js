import React from 'react'
import { Card } from '@aragon/ui'
import styled from 'styled-components'


const RewardCard = styled(Card)`
  width: 50%;
  margin: 40px 0px;
`

const Text = styled.h1`
  font-size: 1.4em;
`

const ProfileImage = styled.img`
  display: inline-block;
`

const Description = styled.div`
  display: inline-block;
`

const RewardItem = (props) => (
  <RewardCard>
    <ProfileImage src={props.image} />
    <Description>
      <Text>{props.from}</Text>
      <Text>{props.to}</Text>
      <h1>{props.amount}</h1>
      <p>{props.message}</p>
    </Description>
  </RewardCard>
)

export default RewardItem