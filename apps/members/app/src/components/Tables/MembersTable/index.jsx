import React from 'react'
import PropTypes from 'prop-types'

import TableRowMember from './TableRowMember'
import { MEMBERS_TABLE_HEADER_TITLES } from '../../../utils/appConstants'

import AragonSortableTable from '../AragonSortableTable'

class MembersTable extends React.Component {

  static propTypes = {
    members: PropTypes.array.isRequired,
    onEditMemberClick: PropTypes.func.isRequired,
    onRemoveMemberClick: PropTypes.func.isRequired
  }

  _handleRenderRow = member => (
    <TableRowMember
      key={member.address}
      member={member}
      onEditClick={this.props.onEditMemberClick}
      onRemoveClick={this.props.onRemoveMemberClick}/>
  )

  _getMembersSortPredicates() {
    return [
      member => member.name,
      member => member.adddress,
      member => member.level.value,
      member => member.reputation,
      member => member.level.value
    ]
  }

  render() {
    return (
      <AragonSortableTable 
        items={this.props.members}
        headerTitles={MEMBERS_TABLE_HEADER_TITLES}
        sortPredicates={this._getMembersSortPredicates()}
        onRenderRow={this._handleRenderRow} />
    )
  }
}

export default MembersTable