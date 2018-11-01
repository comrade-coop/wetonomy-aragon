import React from 'react'
import PropTypes from 'prop-types'
import { Text, Button } from '@aragon/ui'
import {theme} from '@aragon/ui'
import styled from 'styled-components'

const getWeek = (date) =>{
  var firstJan = new Date(date.getFullYear(),0,1)
  var millisecsInDay = 86400000
  return Math.ceil((((date - firstJan) /millisecsInDay) + firstJan.getDay()+1)/7)
}
export const ScreenAction = (props) => { 
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan']
  
  const firstMonth = props.days[0].getMonth()
  const secondMonth = props.days[6].getMonth()
  var weekWork = 0
  var weekTokens = 0
  var workForSync = 0
  var merged = [].concat.apply([], props.workedHours)
  merged.forEach((work) =>{
    weekWork = weekWork + parseInt( work.hours)
    weekTokens = weekTokens + parseInt( work.tokens)
    if(!work.synced) workForSync = workForSync + parseInt(work.hours)
  })
  return (
    <Actions>
      <LeftContainer>
        <WeekButton onClick = {() => props.onWeekChange(-1)}> <Arrow> &lsaquo; </Arrow> </WeekButton>
        <Container>
          <Week onClick = {() => props.onWeekChange(0)}>
            <Text size="xxlarge" color={theme.textSecondary} weight="bold">Week </Text>
            <Text size="xxlarge" color={theme.gradientStart} weight="bold">{getWeek(props.days[0])}</Text><br/>
            <Text size="large" color={theme.textSecondary} >{months[firstMonth]} {props.days[0].getDate()} - {months[secondMonth]} {props.days[6].getDate()}</Text>
          </Week>
        </Container>
        <WeekButton style={{marginLeft: '165px'}} onClick = {() => props.onWeekChange(1)}> <Arrow> &rsaquo; </Arrow></WeekButton>
      </LeftContainer>
      <RgihtContainer>
        <Actions>
          <TimeLogged>Time Logged (Week)</TimeLogged>
          <RgihtContainer>
            <SyncButtonLeft onClick={() => props.onSyncAction(workForSync)}>Sync</SyncButtonLeft>
            <SyncButtonRight onClick={() => props.onClaimAction()}>Claim</SyncButtonRight>
            <Combine onClick={() => props.onSyncAndClaim(workForSync)}> &amp; </Combine>
          </RgihtContainer>
        </Actions>
        <div>
          <HoursLogged>{weekWork}h&nbsp;</HoursLogged>
          <TokensGen color={theme.textSecondary}>- {weekTokens} Tokens Generated</TokensGen>
        </div>
      </RgihtContainer>
    </Actions>
  )
}
ScreenAction.propTypes = {
  workedHours: PropTypes.array.isRequired,
  onWeekChange: PropTypes.func.isRequired,
  onSyncAction: PropTypes.func.isRequired,
  onClaimAction: PropTypes.func.isRequired,
  onSyncAndClaim: PropTypes.func.isRequired,
  days: PropTypes.array.isRequired
}

const Week = styled.div`
  cursor: pointer
  border-radius: 15px;
  :hover {
    box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1);
    background: white;
  }
`
const Actions = styled.div`
  display: flex;
  justify-content:space-between;
  user-select: none;
`
const Container = styled.div`
  position:absolute
  top: 5px;
  display: inline-block;
  width: 135px;
  margin-left:15px;
  margin-right:15px;
`
const RgihtContainer = styled.div`
  position: relative;
`
const LeftContainer = styled.div`
  position: relative;
`
const TimeLogged = styled.div`
  color: #707070a6;
  font-size: 25px;
  font-weight: 300;
  margin: 0;
  display: inline-block;
`
const HoursLogged = styled(Text)`
  font-size: 45px;
  font-weight: 300;
  color: #00B4E6;
  display: inline-block;
  margin-top: 5px;
`
const TokensGen = styled(Text)`
  font-size: 45px;
  font-weight: 300;
  color: #707070a6;
  display: inline-block;
  margin-top: 5px
`
const SyncButtonLeft = styled(Button)`
  width: 80px;
  border-radius: 15px  0 0 15px;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    box-shadow: 0 2px 5px rgba(0,0,0,0.26), 0 2px 5px rgba(0,0,0,0.23);
    border-right:1px solid #e6e6e6;
  }
`
const SyncButtonRight = styled(Button)`
  width: 80px;
  border-radius:  0 15px  15px 0; 
  box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    box-shadow: 0 2px 2px rgba(0,0,0,0.16), 0 2px 2px rgba(0,0,0,0.23);
    border-left:1px solid #e6e6e6;
  }
`
const Combine = styled.div`
  position: absolute;
  cursor: pointer;
  top: 5px;
  padding-top: 3px;
  left: 65px;
  border-radius: 10px;
  height: 30px;
  width: 30px;
  background: white;
  color: #00B4E6;
  font-size: large;
  :hover {
    box-shadow: 0 2px 2px rgba(0,0,0,0.16), 0 2px 2px rgba(0,0,0,0.23);
  }
`
const WeekButton = styled.div`
  position: relative;
  border-radius: 50px;
  font-size: 50px;
  width: 60px;
  height: 60px;
  border: 0px;
  display: inline-block;
  background:white;
  color: #707070;
  cursor: pointer;
  padding-bottom: 0;
  box-shadow: 0 1px 1px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.1);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  :hover {
    box-shadow: 0 3px 3px rgba(0,0,0,0.16), 0 3px 3px rgba(0,0,0,0.23);
  }
`
const Arrow = styled.div`
  position: absolute;
  top: -8px;
  left: 20px;
`

export default ScreenAction