import React, { Component } from 'react';
import { Text, Button } from '@aragon/ui'
import {theme} from '@aragon/ui'
import styled from 'styled-components'
export class  WorkWeekTop extends Component {
	render() {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    
    var secondMonth = months[this.props.today.getMonth()];
    if(this.props.days[0]>this.props.days[6]){
      secondMonth = months[this.props.today.getMonth()+1]
    }
		return (
<<<<<<< HEAD:apps/timetracking/app/src/components/WeekTop.js
					<div>
			<div className = "left-container" >
				<WeekButton mode="normal" onClick = {() => this.props.changeWeek(-1)}> &lsaquo;</WeekButton>
					<div className = "container" >
						<Text size="xxlarge" color={theme.textSecondary} weight="bold" >Week 16</Text><br/>
						<Text size="large" color={theme.textSecondary} >{months[this.props.today.getMonth()]} {this.props.days[0]} - {secondMonth} {this.props.days[6]}</Text>
					</div>
				<WeekButton mode="normal" onClick = {() => this.props.changeWeek(1)}> &rsaquo; </WeekButton>
				</div>
				<div className = "right-container" >
					<h2 className="time-logged" >Time Logged (Week)</h2>
					<h1 className = "head-hours" >{this.props.weekWork}h&nbsp;</h1>
					<h1 color={theme.textSecondary} className = "head-tokens" >- {this.props.weekTokens} Tokens Generated</h1>
				</div>
=======
			<div>
        <LeftContainer>
          <WeekButton mode="normal" onClick = {() => this.props.changeWeek(-1)}> &lsaquo;</WeekButton>
            <Container>
              <Text size="xxlarge" color={theme.textSecondary} weight="bold" >Week 16</Text><br/>
              <Text size="large" color={theme.textSecondary} >{months[this.props.today.getMonth()]} {this.props.days[0]} - {secondMonth} {this.props.days[6]}</Text>
            </Container>
          <WeekButton mode="normal" onClick = {() => this.props.changeWeek(1)}> &rsaquo; </WeekButton>
				</LeftContainer>
				<RgihtContainer>
          <div>
            <TimeLogged>Time Logged (Week)</TimeLogged>
            <SyncButton onClick={() => this.props.app.trackHours(4)}>{this.props.count}</SyncButton>
          </div>
          <div>
            <HoursLogged>{this.props.weekWork}h&nbsp;</HoursLogged>
            <TokensGen color={theme.textSecondary}>- {this.props.weekTokens} Tokens Generated</TokensGen>
          </div>
        </RgihtContainer>
>>>>>>> Edit/Delete traked hours almost done:apps/timetracking/app/src/components/WorkWeekTable/WorkWeekTop.jsx
			</div>
		)
	}
}
<<<<<<< HEAD:apps/timetracking/app/src/components/WeekTop.js
=======
const Container = styled.div`
  display: inline-block;
  width: 135px;
  margin-left:15px;
  margin-right:15px;
`
const RgihtContainer = styled.div`
  float: right;
  text-align: left;
`
const LeftContainer = styled.div`
  float: Left;
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
const SyncButton = styled(Button)`
  margin-left:200px;
`
>>>>>>> Edit/Delete traked hours almost done:apps/timetracking/app/src/components/WorkWeekTable/WorkWeekTop.jsx
const WeekButton = styled.button`
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