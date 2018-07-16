import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from '@aragon/ui'
import {Table, TableRow, TableCell, Text} from '@aragon/ui'
import {theme} from '@aragon/ui'
import styled from 'styled-components'
import WorkButton from './components/WorkButton'
import { getWorkedHours } from './utils/dummyDataProvider'
import { TableRowWork } from './components/TableRowWork'
import { WorkWeekTable } from './components/WorkWeekTable'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { workedHours:undefined }
  }
  componentWillMount() {
    this.loadDummyData()
  }

  loadDummyData() {
    getWorkedHours().then(workedHours => {
      this.setState({ workedHours })
    }).catch(err => {
      console.error('Failed to fetch Worked Hours', err)
    })
  }

  render() {
    return (
      <div className="App">
        {this.state.workedHours==undefined ? (<div></div>) : (
				  <WorkWeekTable workedHours={this.state.workedHours}/>
			  )}
      </div>
    );
  }
}



export default App;
