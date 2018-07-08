import React from 'react'
import {TableRow, TableCell, Text} from '@aragon/ui'
import {theme} from '@aragon/ui'
import Avatar from './Avatar'
import logo from '../assets/logo.svg'
import styled from 'styled-components'


const NameCell = styled(TableCell)`
  & > div {
    justify-content: flex-start;
  }
`


export default (props) => {
  return (
    <TableRow>
      <NameCell>
        <Avatar src={logo} />
        <Text size="large" color={theme.textDimmed}>{props.name}</Text>
      </NameCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{props.accountAddress}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{props.level}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{props.reputation}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{props.payRate}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{props.actions}</Text>
      </TableCell>
    </TableRow>
  )
}

