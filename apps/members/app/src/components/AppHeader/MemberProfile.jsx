import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import Avatar from '../Avatar'

import { ArrowDropUp, Toll } from 'material-react-icons'


const MemberProfile = ({ debt, rewardTokens, member }) => {  
  return (
    <ProfileRoot>      
      <MemberInfoContainer>
        <ArrowDropUpStyled  color={theme.accent} />
        <Text size="large" weight="bold" color={theme.accent}>${debt ? debt : 0}</Text>
      </MemberInfoContainer>      
      
      <MemberInfoContainer>
        <TollStyled  />        
        <Text size="large" weight="bold" color={theme.textDimmed}>{rewardTokens ? rewardTokens : 0}</Text>
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

const ArrowDropUpStyled = styled(ArrowDropUp)`
  margin-right: 5px;
`

const TollStyled = styled(Toll)`
  margin-right: 5px;
`

const ProfileRoot = styled.div`
  display: flex;
  align-items: center;
`

const MemberAvatar = styled(Avatar)`
  margin: 0px 20px;
  cursor: pointer;
`

const MemberInfoContainer = styled.div`
  margin: 0px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  & > span {
    height: 20px;
  }
`

export default MemberProfile