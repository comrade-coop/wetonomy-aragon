import React from 'react'
import { Badge, Field, Text, Button, TextInput, DropDown, theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Task from '../../models/Task'

import { DIFFICULTIES, WORK_FIELD, TASK_TYPES } from '../../utils/appConstants'
import { PROJCETS } from '../../utils/dummyDataProvider'


class BaseTaskForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      ...this.props.state, newProject: '',
    }
  }

  handleTagChange = (event) => {
    const target = event.target
    const value = target.value
    var tags = this.state.tags
    if (event.key === 'Enter') {
      var check = tags.filter(tag => tag == value)
      if (check.length == 0) tags.push(value)
      this.setState({ tags: tags })
      setTimeout(() => this.setState({ tag: '' }))
    }
    this.setState({ tag: value })
  }
  handleWorkFieldChange = (workField) => {
    this.setState({ workField })
  }
  handleDifficultyChange = (difficulty) => {
    this.setState({ difficulty })
  }
  handleProjectChange = (project) => {
    this.setState({ project })
  }
  handleCancelClick = () => {
    this._resetState()
    this.props.onClose()
  }
  handleTokenChange = (tokens) => {
    this.setState({ tokens: parseInt(this.state.tokens) + tokens })
  }
  handleTokenRevert = () => {
    this.setState({ tokens: this.state.originalTokens })
  }
  _resetState = () => {
    document.getElementById('new').style.display = 'none'
    document.getElementById('new-btn').style.display = 'block'
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value
    const name = target.name
    this.setState({ [name]: value })
  }

  handleNewTrackClick = () => {
    let { workField, heading, description, project, tags, difficulty, column, tokens, assignee, issuer } = this.state
    project = PROJCETS[project]
    console.log(this.state)
    // setting id for test purpose
    if (this.state.newProject != '') {
      //project = this.state.newProject;
    }
    let id = this.state.id
    if (id == -1) id = Date.now()
    try {
      const task = new Task(id, workField, heading, description, project, tags, difficulty, column, tokens,  assignee, issuer, TASK_TYPES.NEW)
      this.props.onAddTask(task)
      this._resetState()
    } catch (error) {
      this.setState({ error: error.message })
      console.log('Wrong arguments for task:', error.message)
    }
  }
  newProject = (event) => {
    document.getElementById('new').style.display = 'block'
    document.getElementById('new-btn').style.display = 'none'
    event.target.style.width = '100px'
  }
  cancelNewProject = (event) => {
    document.getElementById('new').style.display = 'none'
    document.getElementById('new-btn').style.display = 'block'
    event.target.style.width = '100px'
  }
  removeTag = (tag) => {
    var newTags = this.state.tags.filter(t => t != tag)
    this.setState({ tags: newTags })
  }
  render() {
    var Tags = undefined
    if (this.state.tags != undefined) {
      Tags = this
        .state
        .tags
        .map(tag =>
          <NewTag
            removeTag={this.removeTag}
            key={this.state.tags.indexOf(tag)}
            name={tag}
          />)
    }
    return (
      <form>
        <Field name="workField" wide label="Work Field:">
          <DropDown
            wide
            items={WORK_FIELD}
            active={this.state.workField}
            onChange={this.handleWorkFieldChange}
          />
        </Field>
        <Field label="Heading:">
          <TextInput
            wide
            type="text"
            name="heading"
            value={this.state.heading}
            onChange={this.handleInputChange}
          />
        </Field>
        <Field label="Description:">
          <TextInput.Multiline
            wide
            type="text"
            name="description"
            value={this.state.description}
            onChange={this.handleInputChange} />
        </Field>
        <Field label="Project">
          <DropDown
            wide
            items={PROJCETS}
            active={this.state.project}
            onChange={this.handleProjectChange}
          />
        </Field>
        <NewButton id="new-btn" onClick={this.newProject}>New Project</NewButton>
        <NewField id="new">
          <Field label="New Project">
            <TextInput
              wide
              type="text"
              name="newProject"
              value={this.state.newProject}
              onChange={this.handleInputChange} />
          </Field>
          <CancelButton onClick={this.cancelNewProject} mode="secondary" emphasis="negative">Cancel</CancelButton>
        </NewField>
        <Field label="Tags">
          <TextInput
            wide
            type="text"
            name="tag"
            value={this.state.tag}
            onKeyPress={this.handleTagChange}
            onChange={this.handleTagChange} />
        </Field>
        <TagContainer>
          {Tags}
        </TagContainer>
        <Field name="difficulty" wide label="Difficulty:">
          <DropDown
            wide
            items={DIFFICULTIES}
            active={this.state.difficulty}
            onChange={this.handleDifficultyChange}
          />
        </Field>
        <Field name="reward" wide label="Reward:">
          <Reward>
            <NotPriority className="star" id={'star'} onClick = {() => this.handleTokenRevert(10)}>
              {this.state.tokens === 0 ? ((
                <i className="material-icons" style={{fontSize: '35px'}}>star_border</i>
              )) : (
                <Tokens>{this.state.tokens}</Tokens>
              )}
            </NotPriority>
            <TopContainer onMouseLeave={this.props.onMouseLeave}>
              <Priority style={{marginLeft: '45px'}} onClick = {() => this.handleTokenChange(10)}>10</Priority>
              <Priority onClick = {() => this.handleTokenChange(20)}>20</Priority>
              <Priority onClick = {() => this.handleTokenChange(30)}>30</Priority>
              <Priority onClick = {() => this.handleTokenChange(40)}>40</Priority>
              <Priority onClick = {() => this.handleTokenChange(50)}>50</Priority>
              <Priority onClick = {() => this.handleTokenChange(60)}>60</Priority>
            </TopContainer>
          </Reward>
        </Field>

        {this.state.error && <Text color={theme.negative}>{this.state.error}</Text>}

        <ActionButtonsContainer>
          <ActionButton mode="secondary" onClick={this.handleCancelClick}>Cancel</ActionButton>
          <ActionButton mode="strong" onClick={this.handleNewTrackClick}>Save</ActionButton>
        </ActionButtonsContainer>
        {this.props.delete &&
          <Delete mode="strong" emphasis="negative" onClick={this.props.onDeleteTask}>Delete</Delete>
        }
      </form>
    )
  }
}
const NewTag = (props) => {
  return (
    <Tag onClick={() => props.removeTag(props.name)}>{props.name}</Tag>
  )
}
BaseTaskForm.propTypes = {
  onClose: PropTypes.func.isRequired
}
const Tokens = styled.div`
  margin-top: 2px;
`
const Reward = styled.div`
  margin: 10px 0 0 10px;
  position: relative;
`
const NotPriority = styled.div`
	height: 45px;
	width: 45px;
	color: #00B4E6;
	text-align: center;
	padding-top: 4px;
	cursor: pointer;
	border-radius: 30px;
	font-size: 22px;
	font-weight: 600;
  display: inline-block;
  background: white;
  position: absolute;
  top: 0;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	:hover {
		box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
  }
`
const TopContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 45px;
  border-radius: 25px;
  box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
`
const Priority = styled.div`
	height: 36px;
	width: 36px;
	color: #fff;
	text-align: center;
	padding-top: 7px;
	cursor: pointer;
	border-radius: 30px;
	font-size: 15px;
	font-weight: 600;
	display: inline-block;
	position: relative;
	background-image: linear-gradient( 130deg,#00B4E6,#00F0E0 );
	box-shadow: 0 0 2px rgba(0,0,0,0.16), 0 0 2px rgba(0,0,0,0.23);
	:hover {
		box-shadow: 0 0 5px rgba(0,0,0,0.26), 0 0 5px rgba(0,0,0,0.33);
  }
`
const Tag = styled(Badge)`
  margin-bottom: 5px;
  cursor: pointer;
	margin-left: 8px;
	padding: 1px 14px 1px 14px;
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
const ActionButtonsContainer = styled.div`
  display:flex;
  margin: 20px 0px;
  justify-content: space-between;
`
const NewButton = styled(Button)`
  display: block;
  margin-left: auto;
  margin-right: auto;
`
const NewField = styled.div`
  margin-left: auto;
  margin-right: auto;
  width:90%;
  display: none;
  transition: display 2s ease;
`
const TagContainer = styled.div`
  margin-bottom: 10px;
`
export default BaseTaskForm