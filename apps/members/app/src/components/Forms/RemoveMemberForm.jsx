import React from 'react'
import PropTypes from 'prop-types'
import { Text, Card, theme } from '@aragon/ui'
import MemberProfileShort from '../MemberProfileShort'
import styled from 'styled-components'

import ActionButtonsContainer from '../ActionButtonsContainer'
import ActionButton from '../ActionButton'

import { 
  REMOVE_MEMBER_FORM_BTN_POSITIVE, 
  REMOVE_MEMBER_FORM_BTN_NEGATIVE,
  REMOVE_MEMBER_QUESTION
} from '../../utils/appConstants'

class RemoveMemberForm extends React.Component {
  static propTypes = {
    onRemoveMember: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    member: PropTypes.object.isRequired
  }

  handleRemoveClick = () => {    
    this.props.onRemoveMember(this.props.member)
    this.props.onCancel()
  }

  render() {
    const { address, name } = this.props.member
    return (
      <section>
        <Text color={theme.textDimmed} size="large">{REMOVE_MEMBER_QUESTION}</Text>
        <MemberCard>
          <MemberProfileShort address={address} name={name} />
          <AddressContainer>
            <Text color={theme.textSecondary}>{address}</Text>
          </AddressContainer>
        </MemberCard>

        <ActionButtonsContainer>
          <ActionButton 
            mode="secondary" 
            onClick={this.props.onCancel}>
            {REMOVE_MEMBER_FORM_BTN_NEGATIVE}
          </ActionButton>
          <ActionButton 
            mode="strong" 
            onClick={this.handleRemoveClick}>            
            {REMOVE_MEMBER_FORM_BTN_POSITIVE}
          </ActionButton>
        </ActionButtonsContainer>
      </section>
    )
  }
}

const AddressContainer = styled.section`
  background-color: white;
  margin-top: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
`

const MemberCard = styled(Card)`
  height: auto;
  width: 100%;
  padding: 20px;  
  background-color: white !important;
  margin: 15px 0px;
  overflow: hidden;
`

export default RemoveMemberForm