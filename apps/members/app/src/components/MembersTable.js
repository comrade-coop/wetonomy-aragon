import React from 'react'
import {Table, TableRow, TableCell, Text, theme} from '@aragon/ui'
import TableRowMember from './TableRowMember'
import PropTypes from 'prop-types'

class MembersTable extends React.Component { 
 
  render() {
    const Members = this.props.members.map(member => 
      <TableRowMember key={member.accountAddress} {...member} />)

    return (
      <Table>
        <TableHeader /> 
        {Members}
      </Table>
    )
  }
}

MembersTable.propTypes = {
  members: PropTypes.array.isRequired
}

const TableHeader = () => (
  <TableRow>
    <LargeDimmedTextCell>Name</LargeDimmedTextCell>
    <LargeDimmedTextCell>Account Address</LargeDimmedTextCell>
    <LargeDimmedTextCell>Experience Level</LargeDimmedTextCell>
    <LargeDimmedTextCell>Reputation</LargeDimmedTextCell>
    <LargeDimmedTextCell>Pay Rate</LargeDimmedTextCell>
    <LargeDimmedTextCell>Actions</LargeDimmedTextCell>
  </TableRow>
)

const LargeDimmedTextCell = (props) => (
  <TableCell>
    <Text size="large" weight="bold" color={theme.textDimmed}>{props.children}</Text>
  </TableCell>
)

export default MembersTable