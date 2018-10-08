import React from 'react'
import styled from 'styled-components'
import { AppBar } from '@aragon/ui'
import PropTypes from 'prop-types'
import { APP_NAME } from '../../utils/appConstants'
import MemberProfile from './MemberProfile'

class AppHeader extends React.Component {

  static propTypes = {
    rewardTokens: PropTypes.number,
    currentMember: PropTypes.string,
    opened: PropTypes.bool,
    onActivityClick: PropTypes.func.isRequired,
    onOutsideClick: PropTypes.func.isRequired
  }

  getEndContent = () => (
    <EndContent>
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

const EndContent = styled.div`
  display: flex;
`

export default AppHeader