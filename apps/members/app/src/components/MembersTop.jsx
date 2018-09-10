import React from 'react'
import styled from 'styled-components'
import { theme, Text, Button } from '@aragon/ui'
import PropTypes from 'prop-types'

import { TOTAL_MEMBERS_COUNT, ADD_NEW_MEMBER } from '../utils/appConstants'

const MembersTop = ({ organizationName, members, onNewMemberClick }) => (  
  <MembersTopRoot>
    <OrgInfo>
      {organizationName && 
        <OrgName size="xlarge" color={theme.textDimmed}>
          {organizationName}
        </OrgName>
      }
      <Text size="xlarge" color={theme.textSecondary}>{TOTAL_MEMBERS_COUNT} {members.length}</Text>
    </OrgInfo>
    <Button mode="strong" onClick={onNewMemberClick}>{ADD_NEW_MEMBER}</Button>
  </MembersTopRoot>   
)

const MembersTopRoot = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`

const OrgInfo = styled.div`
  display: flex;  
  justify-content: flex-start;
  align-items: center;
  margin-right: 20px;
`

const OrgName = styled(Text)`
  font-weight: bold;
  margin-right: 10px;
`

MembersTop.propTypes = {
  organizationName: PropTypes.string,
  members: PropTypes.array.isRequired,
  onNewMemberClick: PropTypes.func.isRequired
}

export default MembersTop