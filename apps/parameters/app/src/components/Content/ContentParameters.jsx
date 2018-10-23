import React from 'react'
import styled from 'styled-components'
import { Text, theme } from '@aragon/ui'
import { PanelMode } from '../../utils/appConstants'

const ContentParameters = (props) => (
  <ParametersBox>
    <Parameters>
      <Text size="xlarge" weight="bold" color={theme.textSecondary}>Members App</Text>
      <ParametersBody>
        <Parameter onClick={() => props.onPannelToggle(PanelMode.MEMBERS_REPUTATUIN)}>
          <Text size="large" color={theme.textSecondary}>Initial Member Reputation:</Text>
          <Text size="large" weight="bold" color={theme.accent}> {props.initialReputation}</Text>
        </Parameter>
      </ParametersBody>
    </Parameters>
    <Parameters>
      <Text size="xlarge" weight="bold" color={theme.textSecondary}>Time Tracking App</Text>
      <ParametersBody>
        <Parameter onClick={() => props.onPannelToggle(PanelMode.TIMETRACKING_PERIOD)}>
          <Text size="large" color={theme.textSecondary}>Period Lenght:</Text>
          <Text size="large" weight="bold" color={theme.accent}> {props.periodLength} days</Text>
        </Parameter>

        <Parameter onClick={() => props.onPannelToggle(PanelMode.TIMETRACKING_MAX_HOURS)}>
          <Text size="large" color={theme.textSecondary}>Max Hours per Month: </Text>
          <Text size="large" weight="bold" color={theme.accent}>{props.maxHoursPerPeriod} h</Text>
        </Parameter>
      </ParametersBody>
    </Parameters>
    <Parameters>
      <Text size="xlarge" weight="bold" color={theme.textSecondary}>Token Manager App</Text>
      <ParametersBody>
        <Parameter onClick={() => props.onPannelToggle(PanelMode.TOKEN_MULTIPLAYER)}>
          <Text size="large" color={theme.textSecondary}>Default Inflation Multiplayer: </Text>
          <Text size="large" weight="bold" color={theme.accent}> x{props.inflationMultiplier} </Text>
        </Parameter>

        <Parameter onClick={() => props.onPannelToggle(PanelMode.REWARD_TO_DAO_COURSE)}>
          <Text size="large" color={theme.textSecondary}>Reward To Dao Course: </Text>
          <Text size="large" weight="bold" color={theme.accent}> x{props.rewardToDaoCourse}</Text>
        </Parameter>
      </ParametersBody>
    </Parameters>
  </ParametersBox>
)
const ParametersBody= styled.div`
  margin-top: 20px;
`

const Parameters = styled.div`
  width: 300px;
  text-align: center;
  padding: 10px;
  border-radius: 15px;
  margin-bottom: 60px;
`
const Parameter = styled.div`
  padding: 8px;
  border-radius: 15px;
  cursor: pointer;
  border: 1px solid #fff;
  :hover {
    background: #f7fbfd;
	}
`
const ParametersBox = styled.div`
  width: 100%;
  background: white;
  border-radius: 15px;
  display: flex;
  justify-content: space-around;
  padding: 20px;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
`
export default ContentParameters