import React from 'react'
import { TableCell, Text, theme } from '@aragon/ui'

export default ({ title }) => (
  <TableCell>
    <Text size="large" color={theme.textDimmed}>{title}</Text>
  </TableCell>
)
