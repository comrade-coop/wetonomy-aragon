import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@aragon/ui'
import styled from 'styled-components'
import { PanelMode } from '../../utils/appConstants'
import TrackedHour from '../../models/TrackedHour'

export const WorkBox = (props) =>{
  const obj = new TrackedHour(props.workedHour._id, props.workedHour._description, props.workedHour._project, props.workedHour._hours, props.workedHour._date, props.workedHour._tokens,  props.workedHour._synced)
  let hours = parseFloat(obj.hours)
  if(hours<=2) hours = 2
  else hours = hours + 1
  var description = obj.description
  var background = `linear-gradient( 130deg,${props.color[0]},${props.color[1]})`
  if(obj.description.length > hours*hours*4) {
    description = obj.description.substring(0, hours*hours*4 - 3)+ ' ...'
  }
  let h = obj.hours
  if(String(obj.hours).length>2) {
    h = (obj.hours).toFixed(2).replace('.',':')
  }
  return (
    <Work style={{background: background ,height: hours*60+'px' }}
      onClick = {()=>props.onPanelToggle(PanelMode.EDIT , props.workedHour)} >
      <Description><Text size="normal">{description}</Text></Description>
      <div style={{marginTop: hours*5+'px' }}>
        <Text size="small">Project: </Text>
        <Text size="small" weight="bold">{obj.project}</Text>
      </div>
      <Hours>
        <Text size="normal" weight="bold">{h}h</Text>
      </Hours>
      <Tokens>
        <Text size="normal" weight="bold">{obj.tokens} Tokens</Text>
      </Tokens>
    </Work>
  )
  
}

WorkBox.propTypes = {
  workedHour: PropTypes.instanceOf(TrackedHour).isRequired,
  onPanelToggle: PropTypes.func.isRequired
}

const Hours = styled.div`
  position: absolute;
  bottom: 15px;
  left: 15px;
`
const Tokens = styled.div`
  position: absolute;
  bottom: 15px;
  right: 15px;
`
const Description = styled.div`
  overflow: hidden;
`
const Work = styled.div`
  color:white;
  position: relative;
  border-radius:5px;
  padding: 15px;
  height: 220px;
  width:90%;
  margin-left: auto;
  margin-right:auto;
  text-align:left;
  margin-top:10px;
  cursor: pointer;
`
export default WorkBox
  
