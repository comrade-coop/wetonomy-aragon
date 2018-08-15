import React from 'react';
import { AragonApp, observe, Text, Button, theme } from '@aragon/ui'
import { getTasks, getColumns, getMemberDebt, getRewardTokens } from './utils/dummyDataProvider'
import { BoardScreen } from './screens/BoardScreen'
import AppHeader from './components/AppHeader'
import TaskPanel, { PanelMode } from './components/TaskPanel'
import styled from '../node_modules/styled-components';
import Task from './models/Task';
import ScreenAction from './components/ScreenAction'
import './App.css';
const initialState = {
  memberDebt: 0,
  rewardTokens: 0,
  columns: undefined,
  tasks: undefined,
  panelMode: PanelMode.ADD,
  screen: 1,
  selectedTask: undefined,
  isTaskPanelOpened: false
}
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...initialState}
  }
  componentWillMount() {
    this.loadDummyData()
  }

  loadDummyData() {
    getTasks().then(tasks => {
      this.setState({ tasks })
      console.log(tasks)
    }).catch(err => {
      console.error('Failed to fetch Tasks', err)
    })

    getColumns().then(columns => {
      this.setState({ columns })
      console.log(columns)
    }).catch(err => {
      console.error('Failed to fetch Columns', err)
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
  handleTaskPanelToggle = (id) => {
    if(id!=undefined){
      var selectedTask = this.state.tasks.filter(task => task.id == id)[0]
      this.setState({selectedTask: selectedTask,panelMode: PanelMode.EDIT,});
    }
    else this.setState({panelMode: PanelMode.ADD,});
    this.setState({ isTaskPanelOpened: !this.state.isTaskPanelOpened })
  }

  handleNewTask = (task) => {
    console.log(task)
    if (task instanceof Task) {
      let tasks = this.state.tasks
      let tracked = tasks.filter(t => t.id == task.id);
      console.log(tracked)
      if(tracked.length == 1){
        for(let key in tasks){
          if(tasks[key].id == tracked[0].id){
            tasks[key] = task
          }
        }
        //ipfs function
        //this.props.app.EditTask()
      } 
      else {
        //ipfs function
        //this.props.app.addTask()
        tasks.push(task)
      }
      this.setState({ tasks: undefined })
      setTimeout(()=>{
        this.setState({ tasks})
      })
      console.log(tasks)
    } else {
      console.error('passed parameter Task should be of type Task')
    }
    this.handleTaskPanelToggle()
  }  
  handleDeleteTask = (id) => {
    let tasks = this.state.tasks
    tasks = tasks.filter(worked => worked._id != id);
    this.setState({ tasks: undefined })
    setTimeout(()=>{
      this.setState({ tasks})
    })
    //ipfs function
    //this.props.app.DeletetrackedHour()
    this.handleTaskPanelToggle()
  }
  changeScreen = (screen) => {
    this.setState({screen: screen})
  }
  handleEditTask(task){

  }
  render() {
    return (
      <AragonApp>
        <AppHeader
          memberDebt={this.state.memberDebt}
          rewardTokens={this.state.rewardTokens} 
        />
        <Screen>
        <ScreenAction 
          handleTaskPanelToggle={this.handleTaskPanelToggle} 
          screen={this.state.screen}
          changeScreen = {this.changeScreen}
        />
        {this.state.columns==undefined && this.state.tasks==undefined? (<div></div>) : (
          <BoardScreen 
            columns={this.state.columns}
            tasks={this.state.tasks}
            handleTaskPanelToggle={this.handleTaskPanelToggle} 
          />
        )}
        </Screen>
        <TaskPanel
          mode = {this.state.panelMode}
          selectedTask = {this.state.selectedTask}
          handleNewTask={this.handleNewTask}
          handleDeleteTask = {this.handleDeleteTask}
          opened={this.state.isTaskPanelOpened}
          onClose={this.handleTaskPanelToggle} />
      </AragonApp>
    );
  }
}

const Screen = styled.div`
  text-align: center;
  padding: 30px 100px 30px 100px;
`
export default observe(
  observable => observable.map(state => ({...state})),
  ({count:"Sync Blockhcain"}),
  {}
)(App)
