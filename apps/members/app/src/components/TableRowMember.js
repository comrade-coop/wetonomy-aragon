import React from 'react'
import {TableRow, TableCell, Text} from '@aragon/ui'
import {theme} from '@aragon/ui'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import logo from '../assets/logo.svg'
import styled from 'styled-components'


const TableRowMember = (props) => {
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
        <Text size="large" color={theme.textDimmed}>${props.payRate}/hr</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{props.actions}</Text>
      </TableCell>
    </TableRow>
  )
}

TableRowMember.propTypes = {
  name: PropTypes.string.isRequired,
  accountAddress: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  reputation: PropTypes.number.isRequired,
  payRate: PropTypes.number.isRequired,
  actions: PropTypes.arrayOf(PropTypes.func).isRequired
}

const NameCell = styled(TableCell)`
  & > div {
    justify-content: flex-start;
  }
`

export default TableRowMember