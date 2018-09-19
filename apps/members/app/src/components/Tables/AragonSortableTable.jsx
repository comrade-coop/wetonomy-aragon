import React from 'react'
import {Table, TableRow} from '@aragon/ui'
import PropTypes from 'prop-types'
import _ from 'lodash'
import memoize from 'memoize-one'

import HeaderTableCell, { SortType } from './HeaderTableCell'

class AragonSortableTable extends React.Component {

  static propTypes = {
    items: PropTypes.array.isRequired,
    headerTitles: PropTypes.array.isRequired,
    sortPredicates: PropTypes.arrayOf(PropTypes.func),
    onRenderRow: PropTypes.func.isRequired
  }

  state = {    
    sortType: SortType.NONE,
    sortHeader: this.props.headerTitles[0]
  }

  // Sort items only when they have changed
  sortItems = memoize((items, sortType, predicate) => this._sortItems(items, sortType, predicate))

  _renderHeader = () => {
    const { sortHeader, sortType } = this.state

    const headerCells = this.props.headerTitles.map(title => (
      <HeaderTableCell
        title={title}
        sortType={sortHeader === title ? sortType : SortType.NONE}
        key={title}
        onClick={() => this._onSortToggle(title)} />
    ))

    return (
      <TableRow>
        {headerCells}
      </TableRow>
    )
  }

  _onSortToggle = sortHeader => {
    const { headerTitles, sortPredicates } = this.props
    const predicate = sortPredicates[headerTitles.indexOf(sortHeader)]

    if (predicate) {
      const previousSort = this.state.sortHeader === sortHeader ? this.state.sortType : SortType.NONE
      const sortType = this._chooseNextSortState(previousSort)      

      this.setState({ sortHeader, sortType })
    }
  }

  _sortItems = (items, sortType, predicate) => {
    switch (sortType) {
      case SortType.ASCENDING:
        return _.sortBy(items, predicate)
      case SortType.DESCENDING:
        return _.sortBy(items, predicate).reverse()
      case SortType.NONE:
      default:
        return this.props.items
    }
  }

  _renderItems() {
    const { headerTitles, sortPredicates, items, onRenderRow } = this.props
    const { sortHeader, sortType } = this.state

    const predicate = sortPredicates[headerTitles.indexOf(sortHeader)]
    const sortedItems = this.sortItems(items, sortType, predicate)

    return sortedItems.map(onRenderRow)
  }

  _chooseNextSortState = previousSortState =>
    !previousSortState || previousSortState === SortType.NONE ?
      SortType.ASCENDING : previousSortState === SortType.ASCENDING ? 
        SortType.DESCENDING : SortType.NONE  

  render() {
    return (
      <Table>
        {this._renderHeader()}
        {this._renderItems()}
      </Table>
    )
  }
}


export default AragonSortableTable