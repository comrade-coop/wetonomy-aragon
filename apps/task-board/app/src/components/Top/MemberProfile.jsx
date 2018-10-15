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

const MemberProfile = props => {
  return (
    <ProfileRoot>
      <OutsideAlerter outsideFunc={props.onOutsideClick}>
        <MemberInfoContainer>
          <Activity>
            <i onClick={props.onActivityClick} className="fas fa-list-ul" />
          </Activity>
          {props.activities.count > 0 ? (
            <Count> {props.activities.count} </Count>
          ) : (
            ''
          )}
          {props.activities.opened ? (
            <ActivityWindow activities={props.activities} />
          ) : (
            ''
          )}
        </MemberInfoContainer>
      </OutsideAlerter>

      <MemberInfo logo={debtLogo} alt="Debt:" info={props.debt} color={theme.accent} />

      <MemberInfo logo={rewardLogo} alt="Rewards:" info={props.rewardTokens} />

      <MemberAvatar seed={props.member} />
      <Text size="large">{props.member.name}</Text>
    </ProfileRoot>
  )
}

MemberProfile.propTypes = {
  debt: PropTypes.number,
  rewardTokens: PropTypes.number,
  member: PropTypes.string.isRequired
}

const MemberInfo = ({ logo, alt, info = 0, color = theme.textDimmed }) => (
  <MemberInfoContainer>
    <Icon src={logo} alt={alt} />
    <Text size="large" weight="bold" color={color}>
      {info}
    </Text>
  </MemberInfoContainer>
)

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
  color: #00cbe6;
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

const MemberAvatar = styled(Avatar)`
  margin: 0px 20px;
  cursor: pointer;
`
const mapStateToProps = state => ({
  activities: state.activities
})
export default connect(mapStateToProps)(MemberProfile)
