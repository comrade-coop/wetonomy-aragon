import React from 'react'
import { Badge, Field, Text, Button, TextInput, DropDown, theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Task from '../../models/Task'

import { DIFFICULTIES, WORK_FIELD } from '../../utils/appConstants'
import {PROJCETS} from '../../utils/dummyDataProvider'


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
    var tags = this.state.tags; 
    if (event.key === 'Enter') {
      var check = tags.filter(tag => tag == value)
      if(check.length==0)tags.push(value)
      this.setState({tags : tags})
      setTimeout(()=>this.setState({tag : ''}))
    }
    this.setState({tag : value})
  }
  handleWorkFieldChange = (workField) => {
    this.setState({workField})
  }
  handleDifficultyChange = (difficulty) => {
    this.setState({difficulty})
  }
  handleProjectChange = (project) => {
    this.setState({project})
  }
  handleCancelClick = () => {
    this._resetState()
    this.props.onClose()
  }

  _resetState = () => {
    document.getElementById("new").style.display = 'none';
    document.getElementById("new-btn").style.display = 'block';
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value
    const name = target.name
    console.log(this.state[name])
    this.setState({[name]: value})
  }

  handleNewTrackClick = () => {
    let {workField, heading, description, project, tags, difficulty, column, tokens} = this.state
    workField = WORK_FIELD[workField]
    project = PROJCETS[project]
    console.log(tokens)
    // setting id for test purpose
    if(this.state.newProject != ''){
        //project = this.state.newProject;
    }
    let id = this.state.id;
    //if(id == 0 ) id = Date.now();
    try {
      const task = new Task(id, workField, heading, description, project, tags, difficulty, column, tokens)
      this.props.handleNewTask(task);
      this._resetState()
    } catch (error) {
      this.setState({error: error.message})
      console.log('Wrong arguments for task:', error.message)      
    }
  }
  newProject= (event) => {
    document.getElementById("new").style.display = 'block';
    document.getElementById("new-btn").style.display = 'none';
    event.target.style.width = "100px";
  }
  cancelNewProject= (event) => {
    document.getElementById("new").style.display = 'none';
    document.getElementById("new-btn").style.display = 'block';
    event.target.style.width = "100px";
  }
  removeTag = (tag) => {
    var newTags = this.state.tags.filter(t => t != tag)
    console.log()
    this.setState({tags : newTags})
  }
  render() {
    var Tags = undefined;
		if(this.state.tags!=undefined){
		  Tags = this
				.state
				.tags
				.map(tag => 
				<NewTag
          removeTag={this.removeTag}
          key = {this.state.tags.indexOf(tag)}
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
            onChange={this.handleInputChange}/>
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
              onChange={this.handleInputChange}/>
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
              onChange={this.handleTagChange}/>
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
        
        
        {this.state.error && <Text color={theme.negative}>{this.state.error}</Text>}

        <ActionButtonsContainer>
          <ActionButton mode="secondary" onClick={this.handleCancelClick}>Cancel</ActionButton>
          <ActionButton mode="strong" onClick={this.handleNewTrackClick}>Save</ActionButton>
        </ActionButtonsContainer>
        { this.props.delete &&
          <Delete mode="strong" emphasis="negative" onClick={() => this.props.handleDeleteTask(this.state.id)}>Delete</Delete>
        }
      </form>
    )
  }
}
export const NewTag = (props) => {
  return (
    <Tag onClick={()=> props.removeTag(props.name)}>{props.name}</Tag>
  )
}
BaseTaskForm.propTypes = {
  onClose: PropTypes.func.isRequired
}
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
const ActionButtonsContainer = styled.div `
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
const TagContainer= styled.div`
  margin-bottom: 10px;
`
export default BaseTaskForm