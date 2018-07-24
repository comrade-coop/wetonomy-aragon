import React from 'react'
import {Table, TableRow, TableHeader} from '@aragon/ui'
import TableRowMember from './TableRowMember'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Member from '../../models/Member'

class MembersTable extends React.Component {

  render() {
    const Members = this
      .props
      .members
      .map(member => {
        const wrappedMember = Member.wrap(member)

        return (
          <TableRowMember
            key={wrappedMember.address}
            member={wrappedMember}
            onEditClick={() => this.props.onEditMemberClick(member)}
            onRemoveClick={() => this.props.onRemoveMemberClick(member)}/>
        )
      })

    return (
      <Table header={< Header />}>
        {Members}
      </Table>
    )
  }
}

MembersTable.propTypes = {
  members: PropTypes.array.isRequired,
  onEditMemberClick: PropTypes.func.isRequired,
  onRemoveMemberClick: PropTypes.func.isRequired
}

const Header = () => (
  <TableRow>
    <TableHeader title="Name"/>
    <TableHeader title="Account Address"/>
    <TableHeader title="Experience Level"/>
    <TableHeader title="Reputation"/>
    <TableHeader title="Pay Rate"/>
    <TableHeaderEnd title="Actions"/>
  </TableRow>
)

const TableHeaderEnd = styled(TableHeader)`
  padding: 0px 21px;
  text-align: right;
`

export default MembersTable