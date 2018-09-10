import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import Avatar from '../Avatar'
import Icon from '../Icon'

import debtLogo from '../../assets/debt.svg'
import rewardLogo from '../../assets/reward-token.svg'

const MemberProfile = ({ debt, rewardTokens, member }) => {  
  return (
    <ProfileRoot>      
      <MemberInfoContainer>
        <BlueIcon src={debtLogo} alt="Debt:" />
        <Text size="large" weight="bold" color={theme.accent}>${debt}</Text>
      </MemberInfoContainer>      
      
      <MemberInfoContainer>
        <Icon src={rewardLogo} alt="Reward Tokens:" />
        <Text size="large" weight="bold" color={theme.textDimmed}>{rewardTokens}</Text>
      </MemberInfoContainer>

      <MemberAvatar seed={member.address} />
      <Text size="large">{member.name}</Text>
    </ProfileRoot>
  )
}

MemberProfile.propTypes = {
  debt: PropTypes.number,
  rewardTokens: PropTypes.number,
  member: PropTypes.object.isRequired
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