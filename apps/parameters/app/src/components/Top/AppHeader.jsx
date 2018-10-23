import React from 'react'
import styled from 'styled-components'
import { AppBar, Text, theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import { APP_NAME } from '../../utils/appConstants'
import MemberProfile from './MemberProfile'

class AppHeader extends React.Component {

  static propTypes = {
    rewardTokens: PropTypes.number,
    currentMember: PropTypes.string,
    opened: PropTypes.bool
  }

  getEndContent = () => (
    <EndContent>
      <NewVote id="newVote">
        <Text size='xlarge' color={theme.accent} weight="bold"> New Voting Created</Text>
      </NewVote>
      {<MemberProfile
        onActivityClick={this.props.onActivityClick}
        onOutsideClick={this.props.onOutsideClick}
        debt={this.props.memberDebt}
        rewardTokens={this.props.rewardTokens}
        member={this.props.currentMember} />}
    </EndContent>
  )


  render() {
    return <AppBar title={APP_NAME} endContent={this.getEndContent()} />
  }
}
const NewVote = styled.div`
  position: absolute;
  width: 300px;
  background: white;
  height: 60px;
  border-radius: 15px;
  border: 1px solid #e6e6e6;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
  padding-top: 12px;
  opacity: 0;
  transition: visibility 0s, opacity 0.5s linear;
  :hover {
    opacity: 1;
  }

`
const EndContent = styled.div`
  display: flex;
`

export default AppHeader