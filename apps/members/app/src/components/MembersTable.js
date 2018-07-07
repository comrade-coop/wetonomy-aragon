import React from 'react'
import {Table, TableHeader, TableRow, TableCell, Text} from '@aragon/ui'

export default () => {
  const Header = <TableRow><TableHeader title="Activity"/></TableRow>
  return (
    <Table header={Header}>
      <TableRow>
        <TableCell>
          <Text>January</Text>
        </TableCell>
        <TableCell>
          <Text>February</Text>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell>
          <Text>10 commits</Text>
        </TableCell>
        <TableCell>
          <Text>32 commits</Text>
        </TableCell>
      </TableRow>
    </Table>
  )
}