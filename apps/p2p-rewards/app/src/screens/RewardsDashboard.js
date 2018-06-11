import React from 'react'
import styled from 'styled-components'
import { Card } from '@aragon/ui'
import emptyIcon from '../assets/empty-card-icon.svg'
import DashboardHeader from '../components/DashboardHeader'
import RewardsHistory from '../components/RewardsHistory'

const EmptyIcon = () => <img src={emptyIcon} alt="" />

const rewards = [1, 3, 4, 5, 23]

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
