import React from 'react'
import { EmptyStateCard, theme } from '@aragon/ui'
import { ICON_SIZE_BIG } from '../utils/appConstants'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { NO_MEMBERS_TITLE, NO_MEMBERS_MSG, NO_MEMBERS_ACTION } from '../utils/appConstants'

import { People } from 'material-react-icons'

const NoMembers = (props) => {
  return (
    <NoMembersRoot>
      <EmptyStateCard
        title={NO_MEMBERS_TITLE}
        text={NO_MEMBERS_MSG}
        actionText={NO_MEMBERS_ACTION}        
        icon={() => <People size={ICON_SIZE_BIG} color={theme.accent} />}
        onActivate={props.onNewMemberClick} />
    </NoMembersRoot>
  )
}

NoMembers.propTypes = {
  onNewMemberClick: PropTypes.func.isRequired
}

const NoMembersRoot = styled.div `
  display: flex;
  align-items: center;
  flex-direction: column;  
  padding-top: 50px;
`

export default NoMembers