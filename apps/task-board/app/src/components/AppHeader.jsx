import React from 'react'
import { AppBar } from '@aragon/ui'
import PropTypes from 'prop-types'
import { APP_NAME } from '../utils/appConstants'
import MemberProfile from './MemberProfile'

const AppHeader = (props) => (
  <AppBar 
    title={APP_NAME}
    endContent={
      <MemberProfile 
        debt={props.memberDebt} 
        rewardTokens={props.rewardTokens} />
    } />
)

AppHeader.propTypes = {
  memberDebt: PropTypes.number.isRequired,
  rewardTokens: PropTypes.number.isRequired
}

export default AppHeader