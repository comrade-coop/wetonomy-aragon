import React from 'react'
import styled from 'styled-components'
import { Card, Text } from '@aragon/ui'

import RewardItem from '../components/RewardItem'
import { SSL_OP_NO_QUERY_MTU } from 'constants';
        
class RewardsHistory extends React.Component {
  render() {
    const rewardItems = this.props.rewards.map(reward => 
      <RewardItem        
        from={'Pesho'}
        to={'Gosho'}
        image={'http://via.placeholder.com/180x200'}
        message={'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates, maiores quaerat'}
        amount={450}
      />
    )
    
    return (
      <Main>
        <Title>RewardsHistory</Title>
        {rewardItems}
      </Main>
    )
  }
}

const Main = styled.div`  
  margin: 20px;
`

const Title = styled.h1`  
  font-size: 2em;
`

export default RewardsHistory