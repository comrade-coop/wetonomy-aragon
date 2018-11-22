import React from 'react'
import styled from 'styled-components'
import { AppBar, Text, theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import { APP_NAME } from '../../utils/appConstants'
import MemberProfile from './MemberProfile'

const AppHeader = (props) => {

  const endContent = 
    <EndContent>
      <NewVote id="newVote">
        <Text size='xlarge' color={theme.accent} weight="bold"> New Voting Created</Text>
      </NewVote>
      {<MemberProfile
        onActivityClick={props.onActivityClick}
        onOutsideClick={props.onOutsideClick}
        debt={props.debtTokens}
        rewardTokens={props.rewardTokens}
        member={props.currentMember} />}
    </EndContent>
  return <AppBar title={APP_NAME} endContent={endContent} />
  
}

AppHeader.propTypes = {
  rewardTokens: PropTypes.number,
  currentMember: PropTypes.string,
  opened: PropTypes.bool
}

const NewVote = styled.div`
  position: absolute;
  width: 300px;
  background: white;
  height: 50px;
  border-radius: 15px;
  border: 1px solid #e6e6e6;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: 8px;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
`
const EndContent = styled.div`
  display: flex;
`

export default AppHeader