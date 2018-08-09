import React from 'react'
import { TableRow, TableCell, Text } from '@aragon/ui'
import { theme } from '@aragon/ui'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import MemberProfileShort from '../MemberProfileShort'
import Icon from '../Icon'

import editLogo from '../../assets/edit.svg'
import removeLogo from '../../assets/delete.svg'

const TableRowMember = (props) => {
  const { name, address, levelNamed, reputation, payRate } = props.member
  
  return (
    <TableRow>
      <NameCell>
        <MemberProfileShort name={name} address={address} />
      </NameCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{address}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{levelNamed}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>{reputation}</Text>
      </TableCell>
      <TableCell>
        <Text size="large" color={theme.textDimmed}>${payRate}/hr</Text>
      </TableCell>
      <ActionsCell>
        <Icon src={editLogo} alt="Edit Member" onClick={props.onEditClick} />
        <Icon src={removeLogo} alt="Remove Member" onClick={props.onRemoveClick} />
      </ActionsCell>
    </TableRow>
  )
}

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