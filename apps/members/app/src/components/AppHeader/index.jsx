import React from 'react'
import {AppBar} from '@aragon/ui'
import PropTypes from 'prop-types'
import {APP_NAME} from '../../utils/appConstants'
import MemberProfile from './MemberProfile'

const AppHeader = ({ currentMember, memberDebt, rewardTokens }) => currentMember ?
  <AppBar
    title={APP_NAME}
    endContent={<MemberProfile
      debt={memberDebt}
      rewardTokens={rewardTokens}
      member={currentMember} />} /> :
  <AppBar title={APP_NAME} /> 

AppHeader.propTypes = {
  memberDebt: PropTypes.number,
  rewardTokens: PropTypes.number,
  currentMember: PropTypes.object
}

export default AppHeader