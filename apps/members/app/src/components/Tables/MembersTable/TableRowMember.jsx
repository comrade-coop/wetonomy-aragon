import React from 'react'
import { TableRow, TableCell, theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import MemberProfileShort from '../../MemberProfileShort'
import DefaultTableCell from '../DefaultTableCell'

import { Edit, Delete } from 'material-react-icons'

const TableRowMember = ({ member, onEditClick, onRemoveClick }) => (
  <TableRow>
    <NameCell>
      <MemberProfileShort name={member.name} address={member.address} />
    </NameCell>
    <DefaultTableCell title={member.address} />
    <DefaultTableCell title={member.level.title} />
    <DefaultTableCell title={member.reputation} />
    <DefaultTableCell title={`${member.level.payRate}/hr`} />    
    <ActionsCell>
      <EditBtn color={theme.accent} onClick={() => onEditClick(member)} />
      <RemoveBtn color={theme.negative} onClick={() => onRemoveClick(member)} />
    </ActionsCell>
  </TableRow>
)

const EditBtn = styled(Edit)`
  cursor: pointer;
  margin-right: 5px;
`

const RemoveBtn = styled(Delete)`
  cursor: pointer;
  margin-right: 5px;
`

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
    justify-content: flex-start;
  }
`


export default TableRowMember