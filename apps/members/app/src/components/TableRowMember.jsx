import React from 'react'
import { TableRow, TableCell, Text } from '@aragon/ui'
import { theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import Avatar from './Avatar'
import styled from 'styled-components'
import Icon from './Icon'

import editLogo from '../assets/edit.svg'
import removeLogo from '../assets/delete.svg'
import Member from '../models/Member'

const TableRowMember = (props) => {
  const member = new Member(props._name, props._address, props._level)
  
  return (
    <TableRow>
      <NameCell>
        <Avatar seed={member.address} />
        <Text size="large" color={theme.textDimmed}>{member.name}</Text>
      </NameCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{member.address}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{member.levelNamed}</Text>
      </TableCell>
      <TableCell>
        {/* TODO: This should be with real reputation */}
        <Text size="large" color={theme.textDimmed}>{0}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>${member.payRate}/hr</Text>
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