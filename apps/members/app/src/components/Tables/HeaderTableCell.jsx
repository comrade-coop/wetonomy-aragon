import React from 'react'
import { TableCell, Text, theme } from '@aragon/ui'
import styled from 'styled-components'
import { ArrowDropUp, ArrowDropDown } from 'material-react-icons'

export const SortType = {
  NONE: 'NONE',
  ASCENDING: 'ASC',
  DESCENDING: 'DESC'
}

const HeaderTableCell = ({ title, sortType, onClick }) => (
  <HeaderTableCellRoot onClick={onClick}>
    <Text weight="bold" size="large" color={theme.textSecondary}>{title}</Text>
    <ArrowsContainer>
      {sortType && sortType === SortType.ASCENDING && <ArrowDropUp color={theme.textSecondary} />}
      {sortType && sortType === SortType.DESCENDING && <ArrowDropDown color={theme.textSecondary} />}
      {sortType && sortType === SortType.NONE && <FakeView />}      
    </ArrowsContainer>
  </HeaderTableCellRoot>
)

// Render invisible element so parent element doesn't stretch when it's sorted
const FakeView = styled(ArrowDropDown)`
  visibility: hidden;
`

const HeaderTableCellRoot = styled(TableCell)`
  & > div {
    justify-content: flex-start;
  }
  cursor: pointer;
`

const ArrowsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export default HeaderTableCell