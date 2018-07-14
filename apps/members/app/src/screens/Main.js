import React from 'react'
import styled from 'styled-components'
import {Button, Text, theme} from '@aragon/ui'
import PropTypes from 'prop-types'

import MembersTable from '../components/MembersTable'
import Avatar from '../components/Avatar'

class Main extends React.Component {
  render() {
    return (
      <MainRoot>
        <MainTop>
          <OrgInfo>
            <Avatar />
            <OrgName size="xlarge" color={theme.textDimmed}>{this.props.organizationName}</OrgName>
            <MemberCount size="xlarge" color={theme.textSecondary}>Total Member count: {this.props.members.length}</MemberCount>
          </OrgInfo>
          <Button mode="strong" onClick={this.props.onNewMemberClick}>Add a new Member</Button>
        </MainTop>

        <MembersTable members={this.props.members} />
      </MainRoot>
    )
  }
}

Main.propTypes = {
  organizationName: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired
}

const MainRoot = styled.main`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 100px;
`

const MainTop = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`

const OrgInfo = styled.div`
  display: flex;  
  justify-content: flex-start;
  align-items: center;
`

const OrgName = styled(Text)`
  font-weight: bold;
  margin-right: 10px;
`

const MemberCount = styled(Text)`
  margin-right: 20px;
  margin-left: 20px;
`

export default Main