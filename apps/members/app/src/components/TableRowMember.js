import React from 'react'
import { TableRow, TableCell, Text } from '@aragon/ui'
import { theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import styled from 'styled-components'
import Icon from './Icon'

import editLogo from '../assets/edit.svg'
import removeLogo from '../assets/delete.svg'

const TableRowMember = (props) => {
  return (
    <TableRow>
      <NameCell>
        <Avatar />
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
      <ActionsCell>
        <Icon src={editLogo} alt="Edit Member" />        
        <Icon src={removeLogo} alt="Remove Member" />
      </ActionsCell>
    </TableRow>
  )
}

TableRowMember.propTypes = {
  name: PropTypes.string.isRequired,
  accountAddress: PropTypes.string.isRequired,
  level: PropTypes.string.isRequired,
  reputation: PropTypes.number.isRequired,
  payRate: PropTypes.number.isRequired
}

const NameCell = styled(TableCell)`
  & > div {
    justify-content: flex-start;
  }
`

const ActionsCell = styled(TableCell)`
  & > div {
    justify-content: flex-end;
  }
`


export default TableRowMember