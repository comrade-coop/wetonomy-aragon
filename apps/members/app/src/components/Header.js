import React from 'react'
import {AppBar, Text} from '@aragon/ui'

export default () => {
  const endContent = (
    <Text size="large">John Smith</Text>
  )

  return <AppBar title="Members" endContent={endContent}/>
}
