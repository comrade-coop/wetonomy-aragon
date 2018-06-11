import React from 'react'
import styled from 'styled-components'
import DashboardHeader from '../components/DashboardHeader'
import RewardsHistory from '../components/RewardsHistory'

const rewards = [1, 2, 3, 4, 5]

const RewardsDashboard = ({ onActivate }) => (
  <Main>
    <DashboardHeader tokenCount={540} />
    <RewardsHistory rewards={rewards}/>
  </Main>
)

const Main = styled.div`
  display: block;
  justify-content: center;
  flex-grow: 1;
`

export default RewardsDashboard
