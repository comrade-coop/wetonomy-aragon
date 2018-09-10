import React from 'react'
import { TableRow, TableCell, Text } from '@aragon/ui'
import { theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import MemberProfileShort from '../MemberProfileShort'
import Icon from '../Icon'

import editLogo from '../../assets/edit.svg'
import removeLogo from '../../assets/delete.svg'

const TableRowMember = ({ member, onEditClick, onRemoveClick }) => (
  <TableRow>
    <NameCell>
      <MemberProfileShort name={member.name} address={member.address} />
    </NameCell>
    <TableCell>
      <Text size="large" color={theme.textDimmed}>{member.address}</Text>
    </TableCell>
    <TableCell>
      <Text size="large" color={theme.textDimmed}>{member.level.title}</Text>
    </TableCell>
    <TableCell>
      <Text size="large" color={theme.textDimmed}>{member.reputation}</Text>
    </TableCell>
    <TableCell>
      <Text size="large" color={theme.textDimmed}>${member.level.payRate}/hr</Text>
    </TableCell>
    <ActionsCell>
      <Icon src={editLogo} alt="Edit Member" onClick={() => onEditClick(member)} />
      <Icon src={removeLogo} alt="Remove Member" onClick={() => onRemoveClick(member)} />
    </ActionsCell>
  </TableRow>
)

TableRowMember.propTypes = {
  member: PropTypes.object.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onRemoveClick: PropTypes.func.isRequired
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