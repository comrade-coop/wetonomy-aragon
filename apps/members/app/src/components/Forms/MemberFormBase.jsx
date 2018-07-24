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
import Member from '../../models/Member'

class MemberFormBase extends React.Component {
  static propTypes = {
    onSubmitMember: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    submitBtnText: PropTypes.string.isRequired,
    name: PropTypes.string,
    address: PropTypes.string,
    level: PropTypes.number
  }

  static defaultProps = {
    name: '',
    address: '',
    level: Member.EXPERIENCE_LEVELS.Junior
  }

  constructor(props) {
    super(props)
    this.state = { ...props, error: null }
  }

  handleLevelChange = (level) => {
    this.setState({level})
  }

  handleClose = () => {
    this._resetState()
    this
      .props
      .onClose()
  }

  _resetState = () => {
    this.setState({ ...MemberFormBase.defaultProps, error: null })
  }

  handleInputChange = (event) => {
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
      const member = new Member(name, address, level)
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
            items={Object.keys(Member.EXPERIENCE_LEVELS)}
            active={this.state.level}
            onChange={this.handleLevelChange}/>
          <PayRateLabel color={theme.textSecondary}>
            Estimated Pay Rate: ${Member.EXPERIENCE_LEVELS_TO_PAYRATE[this.state.level]}/hr
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