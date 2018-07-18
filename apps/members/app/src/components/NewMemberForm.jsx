import React from 'react'
import {
  Field,
  Text,
  Button,
  TextInput,
  DropDown,
  theme
} from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Member from '../models/Member'

const initialState = {
  name: '',
  address: '',
  experienceLevel: Member.EXPERIENCE_LEVELS.Junior,
  error: null
}

class NewMemberForm extends React.Component {
  static propTypes = {
    onAddMember: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      ...initialState
    }
  }

  handleExperienceLevelChange = (experienceLevel) => {
    this.setState({experienceLevel})
  }

  handleCancelClick = () => {
    this._resetState()
    this
      .props
      .onClose()
  }

  _resetState = () => {
    this.setState(initialState)
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value
    const name = target.name

    this.setState({[name]: value})
  }

  handleNewMemberClick = () => {
    const {name, address, experienceLevel} = this.state

    try {
      const member = new Member(name, address, experienceLevel)
      this.props.onAddMember(member)
      this._resetState()
    } catch (error) {
      this.setState({error: error.message})
      console.log('Wrong arguments for member:', error.message)      
    }
  }

  render() {
    return (
      <form>
        <Field label="Name:">
          <TextInput
            wide
            type="text"
            name="name"
            value={this.state.name}
            onChange={this.handleInputChange}/>
        </Field>
        <Field label="Account Address:">
          <TextInput
            wide
            type="text"
            name="address"
            value={this.state.address}
            onChange={this.handleInputChange}/>
        </Field>
        <Field name="experienceLevel" wide label="Experience Level:">
          <DropDown
            items={Object.keys(Member.EXPERIENCE_LEVELS)}
            active={this.state.experienceLevel}
            onChange={this.handleExperienceLevelChange}/>
          <PayRateLabel color={theme.textSecondary}>
            Estimated Pay Rate: ${Member.EXPERIENCE_LEVELS_TO_PAYRATE[this.state.experienceLevel]}/hr
          </PayRateLabel>
        </Field>

        {this.state.error && <Text color={theme.negative}>{this.state.error}</Text>}

        <ActionButtonsContainer>
          <ActionButton mode="secondary" onClick={this.handleCancelClick}>Cancel</ActionButton>
          <ActionButton mode="strong" onClick={this.handleNewMemberClick}>Add</ActionButton>
        </ActionButtonsContainer>
      </form>
    )
  }
}

const ActionButton = styled(Button)`
  width: 48%;
`

const ActionButtonsContainer = styled.div `
  display:flex;
  margin: 20px 0px;
  justify-content: space-between;
`

const PayRateLabel = styled(Text)`
  margin-left: 20px;
`

export default NewMemberForm