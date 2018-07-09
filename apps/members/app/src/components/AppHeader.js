import React from 'react'
import {AppBar, Text, theme} from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Avatar from './Avatar'

import debtLogo from '../assets/debt.svg'
import rewardLogo from '../assets/reward-token.svg'

const AppHeader = (props) => (
  <AppBar 
    title="Wetonomy Members" 
    endContent={<MemberProfile debt={props.memberDebt} rewardTokens={props.rewardTokens} />} />
)

AppHeader.propTypes = {
  memberDebt: PropTypes.number.isRequired,
  rewardTokens: PropTypes.number.isRequired
}


const ProfileRoot = styled.div`
  display: flex;
  align-items: center;
`

const MemberAvatar = styled(Avatar)`
  margin: 0px 20px;
  cursor: pointer;
`

const MemberInfoContainer = styled.span`
  margin: 0px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
`

const InfoLogo = styled.img`
  margin: 0px 10px;
`

const BlueInfoLogo = styled(InfoLogo)`
  fill: ${theme.accent};  
`

const MemberProfile = (props) => (
  <ProfileRoot>
    <MemberInfoContainer>
      <BlueInfoLogo src={debtLogo} alt="Debt:" />
      <Text size="large" weight="bold" color={theme.accent}>${props.debt}</Text>
    </MemberInfoContainer>
    <MemberInfoContainer>
      <InfoLogo src={rewardLogo} alt="Reward Tokens:" />
      <Text size="large" weight="bold" color={theme.textDimmed}>{props.rewardTokens}</Text>
    </MemberInfoContainer>
    <MemberAvatar/>
    <Text size="large">John Smith</Text>
  </ProfileRoot>
)

MemberProfile.propTypes = {
  debt: PropTypes.number.isRequired,
  rewardTokens: PropTypes.number.isRequired
}

export default AppHeader