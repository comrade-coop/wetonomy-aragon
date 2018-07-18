import React from 'react'
import styled from 'styled-components'
import {Button, Text, theme} from '@aragon/ui'
import PropTypes from 'prop-types'

import MembersTable from '../components/MembersTable'
class Main extends React.Component {
  render() {
    return (
      <MainRoot>
        <MainTop>
          <OrgInfo>            
            {this.props.organizationName && 
              <OrgName size="xlarge" color={theme.textDimmed}>
                {this.props.organizationName}
              </OrgName>
            }
            <Text size="xlarge" color={theme.textSecondary}>Total Member count: {this.props.members.length}</Text>
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
  members: PropTypes.array.isRequired,
  onNewMemberClick: PropTypes.func.isRequired
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
  margin-right: 20px;
`

const OrgName = styled(Text)`
  font-weight: bold;
  margin-right: 10px;
`

export default Main