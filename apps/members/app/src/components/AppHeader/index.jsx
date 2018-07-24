import React from 'react'
import {AppBar} from '@aragon/ui'
import PropTypes from 'prop-types'
import {APP_NAME} from '../../utils/appConstants'
import MemberProfile from './MemberProfile'

const AppHeader = (props) => props.currentMember ?
  <AppBar
    title={APP_NAME}
    endContent={<MemberProfile
      debt={props.memberDebt}
      rewardTokens={props.rewardTokens}
      member={props.currentMember} />} /> :
  <AppBar title={APP_NAME} /> 

AppHeader.propTypes = {
  memberDebt: PropTypes.number,
  rewardTokens: PropTypes.number,
  currentMember: PropTypes.object
}

export default AppHeader