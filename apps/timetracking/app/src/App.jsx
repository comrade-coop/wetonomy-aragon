import React, { Component } from 'react';
import { AragonApp, observe, Button } from '@aragon/ui'
import { getMemberDebt, getRewardTokens, getWorkedHours2 } from './utils/dummyDataProvider'
import { WorkWeekTable } from './components/WorkWeekTable/WorkWeekTable'
import TrackPanel , { PanelMode }from './components/TrackPanel'
import AppHeader from './components/AppHeader'
import styled from '../node_modules/styled-components';
import TrackedHour from './models/TrackedHour'
const initialState = {
  organizationName: '',
  workedHours: undefined,
  memberDebt: 0,
  selectedTrack: 0,
  panelMode: PanelMode.BASE,
  rewardTokens: 0,
  isNewTrackPanelOpened: false
}
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState}
  }
  componentWillMount() {
    this.loadDummyData()
  }

  loadDummyData() {
    getWorkedHours2().then(workedHours => {
      this.setState({ workedHours })
      console.log(workedHours)
    }).catch(err => {
      console.error('Failed to fetch Worked Hours', err)
    })
    getMemberDebt().then(memberDebt => {
      this.setState({ memberDebt })
    }).catch(err => {
      console.error('Failed to fetch member debt', err)
    })
    
    getRewardTokens().then(rewardTokens => {
      this.setState({ rewardTokens })
    }).catch(err => {
      console.error('Failed to fetch reward tokens', err)
    })
  }
  handleNewTrackPanelToggle = (element) => {
    document.getElementById("new").style.display = 'none';
    if(element != undefined){
      if (element instanceof TrackedHour){
        this.setState({selectedTrack: element})
        this.setState({
          panelMode: PanelMode.EDIT
        })
      }
      else {
        this.setState({
          selectedTrack: element,
          panelMode: PanelMode.ADD
        })
      }
    } else
    this.setState({
      panelMode: PanelMode.BASE
    })
    this.setState({ isNewTrackPanelOpened: !this.state.isNewTrackPanelOpened })
  }

  handleTrackHour = (trackedHour) => {
    if (trackedHour instanceof TrackedHour) {
      let workedHours = this.state.workedHours
      let tracked = workedHours.filter(worked => worked._id == trackedHour._id);
      if(tracked.length == 1){
        for(let key in workedHours){
          if(workedHours[key]._id == tracked[0]._id){
            workedHours[key] = trackedHour
          }
        }
        //ipfs function
        //this.props.app.EditTrackedHour()
      } 
      else {
        //ipfs function
        //this.props.app.addtrackedHour()
        workedHours.push(trackedHour)
      }
      this.setState({ workedHours: undefined })
      setTimeout(()=>{
        this.setState({ workedHours})
      })
      console.log(workedHours)
      
    } else {
      console.error('passed parameter trackedHour should be of type TrackedHour')
    }
    this.handleNewTrackPanelToggle()
  }  
  handleDeleteTrackHour = (id) => {
    let workedHours = this.state.workedHours
    workedHours = workedHours.filter(worked => worked._id != id);
    this.setState({ workedHours: undefined })
    setTimeout(()=>{
      this.setState({ workedHours})
    })
    //ipfs function
        //this.props.app.DeletetrackedHour()
    this.handleNewTrackPanelToggle()
  }
  render() {
    return (
      <AragonApp>
        <AppHeader
          memberDebt={this.state.memberDebt}
          rewardTokens={this.props.rewardTokens} 
        />
        <Week>
          {this.state.workedHours==undefined ? (<div></div>) : (
            <WorkWeekTable 
              handleNewTrackPanelToggle = {this.handleNewTrackPanelToggle} 
              workedHours={this.state.workedHours}
              count = {this.props.count}
              app = {this.props.app}
              /> 
            )}
        </Week>
        <TrackPanel
          mode = {this.state.panelMode}
          selectedTrack = {this.state.selectedTrack}
          handleTrackHour={this.handleTrackHour}
          handleDeleteTrackHour = {this.handleDeleteTrackHour}
          opened={this.state.isNewTrackPanelOpened}
          onClose={this.handleNewTrackPanelToggle} />
      </AragonApp>
    );
  }
}

const Week = styled.div`
  text-align: center;
  padding: 30px 100px 30px 100px;
`

export default observe(
  observable => observable.map(state => ({...state})),
  ({count:"Sync", rewardTokens: 0}),
  {}
)(App)
