import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { WeekDay } from './WeekDay'
const WeekTable = (props) => {
  var filteredWorkedHours = props.workedHours
  var weekDayHours = [0,0,0,0,0,0,0]
  var weekDayTokens = [0,0,0,0,0,0,0]
  
  for(let i=0; i < 7; i++) {
    for(let j=0; j< filteredWorkedHours[i].length; j++) {
      weekDayHours[i] = weekDayHours[i]+ parseInt( filteredWorkedHours[i][j].hours)
      weekDayTokens[i] = weekDayTokens[i]+ parseInt( filteredWorkedHours[i][j].tokens)
    }
  }
  const Header = props.days.map((day,i) => 
    <WeekDay 
      key = {i} 
      day = {day} 
      id = {i} 
      workedHours={filteredWorkedHours[i]} 
      hours = {weekDayHours[i]} 
      tokens = {weekDayTokens[i]}
      onPanelToggle = {props.onPanelToggle}/>)
      
  return (
    <Table>
      {Header}
    </Table>
  )
}

WeekTable.propTypes = {
  workedHours: PropTypes.array.isRequired,
  today: PropTypes.instanceOf(Date).isRequired,
  days: PropTypes.array.isRequired,
  onPanelToggle: PropTypes.func.isRequired
}

const Table = styled.div`
  background:white;
  width:100%;
  margin-top:20px;
  min-height:700px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  display: flex;
`
export default WeekTable
