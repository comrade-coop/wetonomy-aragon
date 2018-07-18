import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import Avatar from './Avatar'
import Icon from './Icon'

import debtLogo from '../assets/debt.svg'
import rewardLogo from '../assets/reward-token.svg'

const MemberProfile = (props) => (
  <ProfileRoot>
    <MemberInfoContainer>
      <BlueIcon src={debtLogo} alt="Debt:" />
      <Text size="large" weight="bold" color={theme.accent}>${props.debt}</Text>
    </MemberInfoContainer>
    <MemberInfoContainer>
      <Icon src={rewardLogo} alt="Reward Tokens:" />
      <Text size="large" weight="bold" color={theme.textDimmed}>{props.rewardTokens}</Text>
    </MemberInfoContainer>
    <MemberAvatar seed={props.accountAddress} />
    <Text size="large">{props.name}</Text>
  </ProfileRoot>
)

MemberProfile.propTypes = {
  debt: PropTypes.number.isRequired,
  rewardTokens: PropTypes.number.isRequired,
  accountAddress: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
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

const BlueIcon = styled(Icon)`
  fill: ${theme.accent};  
`

export default MemberProfile