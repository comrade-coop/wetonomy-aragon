import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import WeekTable from '../components/WeekTable/WeekTable'
import { ScreenAction } from '../components/Top/ScreenAction'
import styled from 'styled-components'
import { togglePanelWithType } from '../actions/panel'
import { changeWeek, syncHours, claimTokens, syncAndClaim, selectedWork, selectedDay, currentWeek } from '../actions/tracks'
import TrackedHour from '../models/TrackedHour'


class WeekContainer extends Component {

  handlePanelToggle = (type, track = null) => {
    const { dispatch } = this.props
    dispatch(togglePanelWithType(type))
    if(track) {
      if(track instanceof TrackedHour) dispatch(selectedWork(track))
      else {
        const day = this.props.days.find(day => day.getDate() === track)
        dispatch(selectedDay(day))
      }
    }
  }

  handleWeekChange = (direction) => {
    const { dispatch } = this.props
    if(direction === 0) dispatch(currentWeek())
    else 
      dispatch(changeWeek(direction, new Date(this.props.today.getTime())))
  } 

  handleSyncAction = (hours) => {
    if( hours > 0) {
      const { dispatch } = this.props
      dispatch(syncHours(hours))
    }
  }

  handleClaimAction = (direction) => {
    const { dispatch } = this.props
    dispatch(claimTokens(direction))
  } 

  handleSyncAndClaim = (hours) => {
    if( hours > 0) {
      const { dispatch } = this.props
      dispatch(syncAndClaim(hours))
    }
  }


  render() {
    
    return (
      <Week>
        <ScreenAction 
          workedHours ={this.props.workedHours} 
          today={this.props.today} 
          days = {this.props.days} 
          onWeekChange = {this.handleWeekChange}
          onSyncAction = {this.handleSyncAction}
          onClaimAction = {this.handleClaimAction}
          onSyncAndClaim = {this.handleSyncAndClaim}
        />
        <WeekTable 
          days = {this.props.days.map(d => d.getDate())}
          today={this.props.today} 
          onPanelToggle = {this.handlePanelToggle} 
          workedHours={this.props.workedHours}
        /> 
        
      </Week>
    )
  }
}

WeekContainer.propTypes = {
  workedHours: PropTypes.array.isRequired,
  today: PropTypes.instanceOf(Date).isRequired,
  days: PropTypes.array.isRequired
}

const Week = styled.div`
  text-align: center;
  padding: 30px 100px 30px 100px;
`

const mapStateToProps = state => ({
  workedHours: state.tracks.hours,
  today: state.tracks.today,
  days: state.tracks.days,
})


export default connect(mapStateToProps)(WeekContainer)
