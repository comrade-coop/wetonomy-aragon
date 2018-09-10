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
import * as Member from '../../models/Member'

class MemberFormBase extends React.Component {
  static propTypes = {
    onSubmitMember: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    submitBtnText: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    level: PropTypes.object.isRequired
  }

  static defaultProps = {
    name: '',
    address: '',
    level: Member.EXPERIENCE_LEVELS[0]
  }

  constructor(props) {
    super(props)
    this.state = { ...props, levelIndex: this._getLevelIndex(props.level), error: null }
  }

  _getLevelIndex(level) {
    return Member.EXPERIENCE_LEVELS.findIndex(currentLevel => Member.levelEquals(currentLevel, level))
  }

  handleLevelChange = (levelIndex) => {
    const level = this._getMemberLevelFromIndex(levelIndex)
    this.setState({ levelIndex, level })
  }

  handleClose = () => {
    this._resetState()
    this.props.onCancel()
  }

  _resetState = () => {
    this.setState({ ...MemberFormBase.defaultProps, levelIndex: 0, error: null })
  }

  _getMemberLevelFromIndex = index => 
    Member.EXPERIENCE_LEVELS[index]

  handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox'
      ? target.checked
      : target.value
    const name = target.name

    this.setState({[name]: value})
  }

  handleSubmitMemberClick = () => {
    const {name, address, level} = this.state

    try {
      const member = Member.create(name, address, level)
      this.props.onSubmitMember(member)
      this.handleClose()
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
        <Field name="level" wide label="Experience Level:">
          <DropDown
            items={Member.EXPERIENCE_LEVELS.map(level => level.title)}
            active={this.state.levelIndex}
            onChange={this.handleLevelChange} />
          <PayRateLabel color={theme.textSecondary}>
            Estimated Pay Rate: ${Member.EXPERIENCE_LEVELS[this.state.levelIndex].payRate}/hr
          </PayRateLabel>
        </Field>

        {this.state.error && <Text color={theme.negative}>{this.state.error}</Text>}

        <ActionButtonsContainer>
          <ActionButton mode="secondary" onClick={this.handleClose}>Cancel</ActionButton>
          <ActionButton mode="strong" onClick={this.handleSubmitMemberClick}>{this.props.submitBtnText}</ActionButton>
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

export default MemberFormBase