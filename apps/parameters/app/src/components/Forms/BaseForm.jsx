import React from 'react'
import { Field, Text, Button, TextInput, Info } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'


class BaseForm extends React.Component {
  constructor(props) {
    super(props)

    this.state = {value: ''}
  }
  handleCancelClick = () => {
    this._resetState()
    this.props.onClose()
  }

  setCaretPosition() {
    var val = this.state.value,
      start = 2,
      end = 2
    this.setState(
      {
        'value': val.substring(0, start) + '\t' + val.substring(end)
      },
      () => {
        this.refs.input.selectionStart = this.refs.input.selectionEnd = start + 1
      })
  }

  handleInputChange = (event) => {
    const target = event.target
    // const name = target.name
    var value = target.value
    // if(value.substring(value.length-1-this.props.sideInfo.length,value.length-1) === this.props.sideInfo) {
    //   value = value.substring(0, value.length-1-this.props.sideInfo.length)+value[value.length-1]
    // }
    this.setState({ value: value  })
  }
  
  render() {
    return (
      <form>
        <Permissions title="Permission">
          To change some of the app's stetings you must initiate voting! 
        </Permissions>
        <Relative>
          <Field label={this.props.parameter}>
            <TextInput2
              ref="input"
              wide
              type="text"
              name="value"
              value={this.state.value}
              onChange={this.handleInputChange}/>
          </Field>
          
          <Description> 
            <Text> {this.props.sideInfo}</Text>
          </Description>
        </Relative>
        <ActionButtonsContainer>
          <ActionButton mode="secondary" onClick={this.handleClose}>Cancel</ActionButton>
          <ActionButton mode="strong" onClick={() => this.props.onParameterChange(this.props.mode, this.state.value)}>Create</ActionButton>
        </ActionButtonsContainer>
      </form>
    )
  }
}

BaseForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onParameterChange: PropTypes.func.isRequired
}
const Permissions = styled(Info.Permissions)`
  margin-bottom: 20px;
`
const ActionButton = styled(Button)`
  width: 48%;
`
const TextInput2 = styled(TextInput)`
  // width: 100px;
  text-align: center;
`
const ActionButtonsContainer = styled.div `
  display:flex;
  margin: 20px 0px;
  justify-content: space-between;
`
const Description = styled.div `
  position: absolute;
  top: 0
  right: 5px;
  text-transform: lowercase;
  font-variant: small-caps;
  color: #707070;
`

const Relative = styled.div `
  position: relative;
`
export default BaseForm