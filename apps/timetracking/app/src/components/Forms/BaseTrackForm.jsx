import React from 'react'
import { Field, Text, Button, TextInput, DropDown, theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import TrackedHour from '../../models/TrackedHour'

import {WORK_HOURS, WORK_MINUTES} from '../../utils/appConstants'
import {PROJECTS} from '../../utils/dummyDataProvider'


class BaseTrackForm extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      ...this.props.state, newProject: ''
    }
  }

  handleHourChange = (hours) => {
    this.setState({hours})
  }
  handleMinuteChange = (minutes) => {
    this.setState({minutes})
  }
  handleProjectChange = (project) => {
    this.setState({project})
  }
  handleCancelClick = () => {
    this._resetState()
    this.props.onClose()
  }

  _resetState = () => {
    document.getElementById('new').style.display = 'none'
    document.getElementById('new-btn').style.display = 'block'
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({[name]: value})
  }

  handleNewTrackClick = () => {
    let {description, project, hours, minutes} = this.state
    hours = WORK_HOURS[hours]
    minutes = WORK_MINUTES[minutes]
    project = PROJECTS[project]
    const parsedHours = parseInt(hours) + minutes/100
    let date = this.props.day
    if(this.state.newProject !== '') {
      //project = this.state.newProject;
    }
    let id = this.state.id
    if(id === 0 ) id = Date.now()
    try {
      const trackedHour = new TrackedHour(id, description, project, parsedHours, date)
      console.log(trackedHour)
      this.props.onTrackHour(trackedHour)
      this._resetState()
    } catch (error) {
      this.setState({error: error.message})
      console.log('Wrong arguments for traked hours:', error.message)      
    }
  }
  newProject= (event) => {
    document.getElementById('new').style.display = 'block'
    document.getElementById('new-btn').style.display = 'none'
    event.target.style.width = '100px'
  }
  cancelNewProject= (event) => {
    document.getElementById('new').style.display = 'none'
    document.getElementById('new-btn').style.display = 'block'
    event.target.style.width = '100px'
  }
  render() {
    return (
      <form>
        <Field label="Description:">
          <Description
            wide
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange}/>
        </Field>
        <Field label="Project">
          <DropDown
            wide
            items={PROJECTS}
            active={this.state.project}
            onChange={this.handleProjectChange}
          />            
        </Field>
        <NewButton onClick={this.newProject}>New Project</NewButton>
        <NewField id="new">
          <Field label="NewProject">
            <TextInput
              wide
              type="text"
              name="newProject"
              value={this.state.newProject}
              onChange={this.handleInputChange}/>
          </Field>
          <CancelButton onClick={this.cancelNewProject} mode="secondary" emphasis="negative">Cancel</CancelButton>
        </NewField>
        <Field name="workedTime" wide label="Worked Time:">
          <DropDown
            items={WORK_HOURS}
            active={this.state.hours}
            onChange={this.handleHourChange}
          />
          <Inbox color={theme.textSecondary}>Hours</Inbox>
          <DropDown
            items={WORK_MINUTES}
            active={this.state.minutes}
            onChange={this.handleMinuteChange}
          />
          <Inbox color={theme.textSecondary}>Minutes</Inbox>
        </Field>

        {this.state.error && <Text color={theme.negative}>{this.state.error}</Text>}

        <ActionButtonsContainer>
          <ActionButton mode="secondary" onClick={this.handleCancelClick}>Cancel</ActionButton>
          <ActionButton mode="strong" onClick={this.handleNewTrackClick}>Save</ActionButton>
        </ActionButtonsContainer>
        { this.props.delete &&
          <Delete mode="strong" emphasis="negative" onClick={() => this.props.onDeleteHour()}>Delete</Delete>
        }
      </form>
    )
  }
}

BaseTrackForm.propTypes = {
  day: PropTypes.instanceOf(Date).isRequired,
  state: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onTrackHour: PropTypes.func.isRequired,
  onDeleteHour: PropTypes.func,
  delete: PropTypes.bool.isRequired
}
const Description = styled(TextInput.Multiline)`
  min-height: 120px;
`

const CancelButton = styled(Button)`
  display:block;
  margin-left: auto;
  margin-right: auto;
`
const ActionButton = styled(Button)`
  width: 48%;
`
const Delete = styled(Button)`
  width: 100%;
`
const ActionButtonsContainer = styled.div `
  display:flex;
  margin: 20px 0px;
  justify-content: space-between;
`

const Inbox = styled(Text)`
  margin: 15px;
`
const NewButton = styled(Button)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 1px 1px rgba(0,0,0,0.2);
  :hover {
    box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  }
`

const NewField = styled.div`
  margin-left: auto;
  margin-right: auto;
  width:90%;
  display: none;
  transition: display 2s ease;
`
export default BaseTrackForm