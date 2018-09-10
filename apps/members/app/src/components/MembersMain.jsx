import React from 'react'
import styled from 'styled-components'
import MembersTopContainer from '../containers/MembersTopContainer'
import MembersTableContainer from '../containers/MembersTableContainer'

const MembersMain = () => (
  <Root>
    <MembersTopContainer />
    <MembersTableContainer />        
  </Root>
)

const Root = styled.main`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  padding: 100px;
`

export default MembersMain