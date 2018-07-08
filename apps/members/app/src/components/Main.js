import React from 'react'
import styled from 'styled-components'
import MembersTable from './MembersTable'
import {Button, Text, theme} from '@aragon/ui'
import Avatar from './Avatar'
import logo from '../assets/logo.svg'

const MainRoot = styled.main `
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 100px;
`

const Top = styled.div `
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 24px;
`

const OrgInfo = styled.div `
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
`

export default class Main extends React.Component {
  render() {
    return (
      <MainRoot>
        <Top>
          <OrgInfo>
            <Avatar src={logo} alt={this.props.name}/>
            <OrgName size="xlarge" color={theme.textDimmed}>Comrade</OrgName>
          </OrgInfo>
          <div>
            <MemberCount size="large" color={theme.textDimmed}>Total Member count: 7</MemberCount>
            <Button mode="strong">Add a new Member</Button>
          </div>
        </Top>
        <MembersTable/>
      </MainRoot>
    )
  }
}
