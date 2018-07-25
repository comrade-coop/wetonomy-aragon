import React, { Component } from 'react';
import { WorkWeekTableRow } from './WorkWeekTableRow'
import {Table } from '@aragon/ui'
import styled from 'styled-components'
import calendar from "node-calendar"
import { WorkWeekTop } from './WorkWeekTop'
import { WorkWeekTableHeader } from './WorkWeekTableHeader'
export class WorkWeekTable extends Component {
	constructor(props) {
    super(props);
    var date = new Date();
    date = date.setDate(date.getDate() - date.getDay()+1);
    date = new Date(date);
    this.state = {
      today: date,
      days: this.getWeek(date.getFullYear(),date.getMonth()+1,date.getDate())
    };
    this.changeWeek = this.changeWeek.bind(this);
  }
  componentWillMount() {
    var date = new Date(this.state.today);
    var date2 = new Date(this.state.today);
    this.filterWork(this.props.workedHours,date,date2)
  }
  getWeek(year,month,day) {
    var days = new calendar.Calendar(0).itermonthdays(year,month)
    var weeks = new calendar.Calendar(0).monthdayscalendar(year,month)
    var weekNum = days.indexOf(day)
    if(weekNum%7>0) weekNum = parseInt(weekNum/7);
    else  weekNum = parseInt(weekNum/7);
    
    switch(weekNum){
      case 0: days = weeks[0] ; break;
      case 1: days = weeks[1] ; break;
      case 2: days = weeks[2] ; break;
      case 3: days = weeks[3] ; break;
      case 4: days = weeks[4] ; break;
      case 5: days = weeks[5] ; break;
    }
    if(days[6] == 0){
      var d = 1;
      for(var i=0; i<7; i++){
        if(days[i] == 0) {
          days[i] = d;
          d++;
        }
      }
    }
    if(days[0] == 0){
      var date = this.state.today
      date = date.setDate(date.getDate() - 7);
      date = new Date(date);
      this.getWeek(date.getFullYear(),date.getMonth()+1,date.getDate())
    }
    return days;
  }
  changeWeek(direction){
    var date = this.state.today
    var workedHours = this.props.workedHours
    if(direction == 1){
      date.setDate(date.getDate() + 7);
    }
    else date.setDate(date.getDate() - 7);
    var date1 = new Date(date)
    var date2 = new Date(date)
    this.filterWork(workedHours,date1,date2)
    //console.log(date)
    this.setState({
      today: date,
      days: this.getWeek(date.getFullYear(),date.getMonth()+1,date.getDate()),
    })
  }
  filterWork(workedHours,date1,date2){
    date1.setDate(date1.getDate() -1);
    date2.setDate(date2.getDate() + 6);
    var filteredWorkedHours = [[],[],[],[],[],[],[]];
    for(let i=0; i<workedHours.length; i++){
      let date = new Date(workedHours[i].date)
      if(date > date1 && date < date2) {
        filteredWorkedHours[date.getDay()].push(workedHours[i])
      }
    }
    this.setState({ filteredWorkedHours })
  }
	render() {
		var weekDayHours = [0,0,0,0,0,0,0];
    var weekDayTokens = [0,0,0,0,0,0,0];
    var weekWork = 0;
    var weekTokens = 0;
    if(this.state.filteredWorkedHours!= undefined)
      for(let i=0; i<this.state.filteredWorkedHours.length; i++){
        for(let j=0; j<this.state.filteredWorkedHours[i].length; j++){
          weekDayHours[i] = weekDayHours[i]+ parseInt(this.state.filteredWorkedHours[i][j]._hours)
          weekWork = weekWork + parseInt(this.state.filteredWorkedHours[i][j]._hours)
          weekDayTokens[i] = weekDayTokens[i]+ parseInt(this.state.filteredWorkedHours[i][j]._tokens)
          weekTokens = weekTokens + parseInt(this.state.filteredWorkedHours[i][j]._tokens)
        }
      }
    
    const WorkDone = <WorkWeekTableRow handleNewTrackPanelToggle = {this.props.handleNewTrackPanelToggle} days = {this.state.days}
     workedHours = {this.state.filteredWorkedHours}/>
    const Header = <WorkWeekTableHeader day = {this.state.days} hours = {weekDayHours} tokens = {weekDayTokens}/>
    return (
      <div>
        <WorkWeekTop 
          weekWork ={weekWork} 
          weekTokens ={weekTokens} 
          today={this.state.today} 
          days = {this.state.days} 
          changeWeek = {this.changeWeek}
          app = {this.props.app}
          count = {this.props.count}
        />
        <WeekTable>
          {Header}
          {WorkDone}
			  </WeekTable>
      </div>
		)
	}
}

const WeekTable = styled(Table)`
  background:white;
  width:100%;
  margin-top:100px;
`
