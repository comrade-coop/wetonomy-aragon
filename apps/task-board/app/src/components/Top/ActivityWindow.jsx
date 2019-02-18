import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
// import PropTypes from 'prop-types'
import { Text } from '@aragon/ui'
import Contribute from './Activities/Contribute'
import ChangeStage from './Activities/ChangeStage'
import CRUD from './Activities/CRUD'
import { deleteActivity, clearActivities } from '../../actions/activities'
import { reloadTaskState, reloadFullState, syncActivities } from '../../actions/tasks'


class ActivityWindow extends React.Component {
  loadStateChanges = () => {
    return this.props.activities.stateChanges.map(task =>
      <ChangeStage
        key={'stateChanges' + task.id}
        onDelete={this.handleDeleteActivity}
        task={task}
      />)
  }
  loadContribution = () => {
    return this.props.activities.contributions.map(task =>
      <Contribute
        key={'contribute' + task.id}
        onDelete={this.handleDeleteActivity}
        task={task}
      />)
  }
  loadCRUD = () => {
    return this.props.activities.crudActivity.map(task =>
      <CRUD
        key={'crud' + task.id}
        onDelete={this.handleDeleteActivity}
        task={task}
      />)
  }
  handleDeleteActivity = (task, type) => {
    const { dispatch } = this.props
    dispatch(deleteActivity(task, type))
    dispatch(reloadTaskState(task))
  }
  handleSyncActivities = () =>{
    const { dispatch } = this.props
    dispatch(syncActivities(this.props.activities))
    dispatch(reloadFullState())
    dispatch(clearActivities())
  }
  render() {
    return (
      <ActivityW>
        <Angle></Angle>
        <Header>Activity Bag</Header>
        <Activities>
          {this.props.activities.contributions.length > 0 ? ((
            <div>
              <StageHeader>
                <Text>Given Rewards</Text>
              </StageHeader>
              <Change>
                {this.loadContribution()}
              </Change>
            </div>
          )) : ('')}
          {this.props.activities.stateChanges.length > 0 ? ((
            <div>
              <StageHeader>
                <Text>Stage Change</Text>
              </StageHeader>
              <Change>
                {this.loadStateChanges()}
              </Change>
            </div>
          )) : ('')}
          {this.props.activities.crudActivity.length > 0 ? ((
            <div>
              <StageHeader>
                <Text>Task Interaction</Text>
              </StageHeader>
              <Change>
                {this.loadCRUD()}
              </Change>
            </div>
          )) : ('')}
        </Activities>
        <Footer onClick={this.handleSyncActivities}>
          Sync Activities
        </Footer>
      </ActivityW>)
  }
}
const Activities = styled.div`
	overflow: auto;
	height: 500px;
	width: 100%;
	border-radius: 0 0 10px 10px;
`
const Change = styled.div`
	border-top: 1px solid #e6e6e6;
	border-bottom: 1px solid #e6e6e6;
	padding: 10px 20px;
	background: #fcfcfc;
`
const StageHeader = styled.div`
	color: #7e7e7e;
	padding: 0px 20px;
	margin-top: 10px;
	font-size: 17px;
`
const Header = styled.div`
	background: white;
	color: #00B4E6;
	width: 100%;
	height: 50px;
	z-index: 6;
	position: relative;
	padding-top:10px;
	border-radius: 10px 10px 0 0;
	border-bottom: 1px solid #E6E6E6;
	text-align: center;
	font-size: 20px;
`
const Footer = styled.div`
	background: linear-gradient( 130deg,#00B4E6,#00F0E0 );
	color: white;
	width: 100%;
	height: 50px;
	z-index: 6;
	position: relative;
	padding-top:10px;
	border-radius:  0 0 10px 10px;
	border-top: 1px solid #E6E6E6;
	text-align: center;
	font-size:20px;
`
const ActivityW = styled.div`
	background: white;
	position:absolute;
	width: 370px;
	height: 600px;
  top: 50px;
  right: -115px;
	z-index: 3;
	border-radius: 10px;
	box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
	:hover {
			box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
	}
`
const Angle = styled.div`
  position:absolute;
  width: 50px;
  height: 50px;
  top: -10px;
  right: 100px;
  background: white;
  z-index: 5;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
`
const mapStateToProps = state => ({
  activities: state.activities
})
export default connect(mapStateToProps)(ActivityWindow)