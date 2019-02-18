import React from 'react'
import styled from 'styled-components'
import { AppBar } from '@aragon/ui'
import PropTypes from 'prop-types'
import { APP_NAME } from '../../utils/appConstants'
import MemberProfile from './MemberProfile'

const  AppHeader = (props) => { 
  const endContent =  <EndContent>
    {<MemberProfile
      onActivityClick={props.onActivityClick}
      onOutsideClick={props.onOutsideClick}
      debt={props.daoTokens}
      rewardTokens={props.rewardTokens}
      member={props.currentMember} />}
  </EndContent>
  
  return <AppBar title={APP_NAME} endContent={endContent} />
  
}
AppHeader.propTypes =  {
  rewardTokens: PropTypes.number,
  daoTokens: PropTypes.number,
  currentMember: PropTypes.string,
  opened: PropTypes.bool,
  onActivityClick: PropTypes.func.isRequired,
  onOutsideClick: PropTypes.func.isRequired
}

const EndContent = styled.div`
  display: flex;
`


export default AppHeader