import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, theme, Button } from '@aragon/ui'
import WorkBox from './WorkBox'
import {COLORS} from  '../../utils/dummyDataProvider'
import { PanelMode } from '../../utils/appConstants'

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const WeekDay = (props) => {
  var WorkedHours = props.workedHours.map((workedHour,id) => 
    <WorkBox 
      key={id} 
      workedHour = {workedHour} 
      color={COLORS[workedHour.project]}
      onPanelToggle = {props.onPanelToggle}
    />)
  
  return (
    <DayCell>
      <Header>
        <Text size="xlarge" color={theme.textDimmed}>{props.day}.{WEEK_DAYS[props.id]}</Text><br/>
        <Text size="xlarge" color={theme.textTertiary}>{props.hours}h - {props.tokens} Tokens </Text>
      </Header>
      
      {WorkedHours}
      <TrackWork onClick = {()=>props.onPanelToggle(PanelMode.ADD, props.day)} mode="normal"><Text size="xlarge">+ Track Work</Text></TrackWork>

    </DayCell>
  )
}

WeekDay.propTypes = {
  workedHours: PropTypes.array.isRequired,
  day: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  hours: PropTypes.number.isRequired,
  tokens: PropTypes.number.isRequired,
  onPanelToggle: PropTypes.func.isRequired
}

const Header = styled.div`
  border-bottom: 1px solid #E6E6E6;
  padding: 20px;
  text-align: left;
  :first-child {
    border-radius: 5px 0 0 0;
  }
  :last-child {
    border-radius: 0 5px 0 0;
  }
`

const TrackWork = styled(Button)`
	margin-top:15px;
	width: 90%;
	box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	:hover {
		box-shadow: 0 3px 3px rgba(0,0,0,0.16), 0 3px 3px rgba(0,0,0,0.23);
`

const DayCell = styled.div`
  border: 1px solid #E6E6E6;
  width:15%;
  padding-bottom: 20px;
  min-height:700px;
	text-align:center
  :first-child { 
    border-radius: 10px 0 0 10px;
  }
  :last-child { 
    border-radius: 0 10px 10px 0;
  }
`


export default WeekDay