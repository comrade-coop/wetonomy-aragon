import React from 'react'
import styled from 'styled-components'
import { Button } from '@aragon/ui'

import NavMenu from '../Top/NavMenu'

const ScreenAction = ({ onNewTaskClick }) => (
  <ScreenActionRoot>
    <NavMenu />
    <ActionButtonsContainer>
      <MarginedButton mode="outline">Post an Achievment</MarginedButton>
      <MarginedButton mode="strong" onClick={onNewTaskClick}>Add a New Task</MarginedButton>
    </ActionButtonsContainer>
  </ScreenActionRoot>
)

const ActionButtonsContainer = styled.div`
  display: flex;
`

const MarginedButton = styled(Button)`
  margin: 0px 10px;
`

const ScreenActionRoot = styled.section`
  display: flex;
  justify-content: space-between;
  padding: 90px 30px 30px 30px;
`


export default ScreenAction
