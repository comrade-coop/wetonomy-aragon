import React, { Component } from 'react';
import { Text } from '@aragon/ui'
import styled from 'styled-components'
class WorkButton extends Component {
    constructor(props) {
      super(props);
    }
    render() {
      const obj = { ... this.props.workedHour}
      let hours = parseFloat(obj._hours);
      if(hours<=2) hours = 2;
      else hours = hours + 1;
      var description = obj._description;
      var background = `linear-gradient( 130deg,${this.props.color[0]},${this.props.color[1]})`
      if(obj._description.length > hours*hours*4){
        description = obj._description.substring(0, hours*hours*4 - 3)+ " ..."
      }
      let h = obj._hours
      if(String(obj._hours).length>2){
        h = (obj._hours).toFixed(2).replace(".",":")
      }
      return (
        <div>
        <WButton style={{background: background ,height: hours*60+"px" }}
          onClick = {()=>this.props.handleNewTrackPanelToggle(this.props.workedHour)} >
          <Description><Text size="large">{description}</Text></Description>
          <div style={{marginTop: hours*5+"px" }}><Text size="normal">Project: {obj._project}</Text></div>
            <Hours size="large">{h}h</Hours>
            <Tokens size="large">{obj._tokens} Tokens</Tokens>
        </WButton>
        </div>
      )
    }
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
const WButton = styled.div`
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
export default WorkButton
  
