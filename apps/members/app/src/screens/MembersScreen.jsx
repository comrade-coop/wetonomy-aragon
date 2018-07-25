import React from 'react'
import styled from 'styled-components'
import {Button, Text, theme} from '@aragon/ui'
import PropTypes from 'prop-types'

import MembersTable from '../components/MembersTable'

class MembersScreen extends React.Component {
  static propTypes = {
    organizationName: PropTypes.string,
    members: PropTypes.array.isRequired,
    onNewMemberClick: PropTypes.func.isRequired,
    onEditMemberClick: PropTypes.func.isRequired,
    onRemoveMemberClick: PropTypes.func.isRequired,
    onMemberSelect: PropTypes.func.isRequired
  }

  handleMemberEditClick = (member) => {    
    this.props.onMemberSelect(member)
    this.props.onEditMemberClick(member)
  }

  handleMemberRemoveClick = (member) => {    
    this.props.onMemberSelect(member)
    this.props.onRemoveMemberClick(member)
  }

  render() {
    return (
      <MembersRoot>
        <MembersTop>
          <OrgInfo>            
            {this.props.organizationName && 
              <OrgName size="xlarge" color={theme.textDimmed}>
                {this.props.organizationName}
              </OrgName>
            }
            <Text size="xlarge" color={theme.textSecondary}>Total Member count: {this.props.members.length}</Text>
          </OrgInfo>
          <Button mode="strong" onClick={this.props.onNewMemberClick}>Add a new Member</Button>
        </MembersTop>

        <MembersTable 
          members={this.props.members} 
          onEditMemberClick={this.handleMemberEditClick}
          onRemoveMemberClick={this.handleMemberRemoveClick} />
      </MembersRoot>
    )
  }
}

const MembersRoot = styled.main`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 100px;
`

const MembersTop = styled.div`
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

export default MembersScreen