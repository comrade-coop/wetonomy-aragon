import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import Avatar from './Avatar'
import Icon from './Icon'
import ActivityWindow from './ActivityWindow'
import debtLogo from '../../assets/debt.svg'
import rewardLogo from '../../assets/reward-token.svg'
import OutsideAlerter from './OutsideAlerter'

const MemberProfile = (props) => {
  return (
    <ProfileRoot>
      <OutsideAlerter outsideFunc={props.onOutsideClick}>
        <MemberInfoContainer>
          <Activity>
            <i onClick={props.onActivityClick} className="fas fa-list-ul"></i>
          </Activity>
          {props.activities.count > 0 ? ((
            <Count> {props.activities.count} </Count>
          )) : ('')}
          {props.activities.opened ? ((
            <ActivityWindow activities={props.activities} />
          )) : ('')}

        </MemberInfoContainer>
      </OutsideAlerter>

      <MemberInfoContainer>
        <BlueIcon src={debtLogo} alt="Debt:" />
        <Text size="large" weight="bold" color={theme.accent}>${props.debt}</Text>
      </MemberInfoContainer>

      <MemberInfoContainer>
        <Icon src={rewardLogo} alt="Reward Tokens:" />
        <Text size="large" weight="bold" color={theme.textDimmed}>{props.rewardTokens}</Text>
      </MemberInfoContainer>

      <MemberAvatar seed={props.member} radius={'50%'} width={'40px'} />
      <Text size="large">{props.member.name}</Text>
    </ProfileRoot>
  )
}

MemberProfile.propTypes = {
  debt: PropTypes.number,
  rewardTokens: PropTypes.number,
  member: PropTypes.string.isRequired
}

const Count = styled.div`
  color: white;
  background: #d01b1b;
  width: 15px;
  height: 15px;
  position: absolute;
  top: 12px;
  right: 292px;
  border-radius: 25px;
  text-align: center;
  font-size: 11px;
`

const Activity = styled.div`
  color: #00CBE6;
  font-size: 22px;
`

const ProfileRoot = styled.div`
  display: flex;
  align-items: center;
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

const MemberAvatar = styled(Avatar)`
  margin: 0px 20px;
  cursor: pointer;
`
const mapStateToProps = state => ({
  activities: state.activities
})
export default connect(mapStateToProps)(MemberProfile)