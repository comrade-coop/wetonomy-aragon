import React from 'react'
import {Table, TableHeader, TableRow} from '@aragon/ui'
import TableRowMember from './TableRowMember'

const Header = (
  <TableRow>    
    <TableHeader title="Name"/>
    <TableHeader title="Account Address"/>
    <TableHeader title="Experience Level"/>
    <TableHeader title="Reputation"/>
    <TableHeader title="Pay Rate"/>
    <TableHeader title="Actions"/>
  </TableRow>
)

const members = [
  { name: 'John Smith', accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724E86', level: 'Senior', reputation: 324, payRate: '$24/hr' },
  { name: 'John Smith', accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724C86', level: 'Senior', reputation: 324, payRate: '$24/hr' },
  { name: 'John Smith', accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724D86', level: 'Senior', reputation: 324, payRate: '$24/hr' },
  { name: 'John Smith', accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724F86', level: 'Senior', reputation: 324, payRate: '$24/hr' },
  { name: 'John Smith', accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724G86', level: 'Senior', reputation: 324, payRate: '$24/hr' },
  { name: 'John Smith', accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724T86', level: 'Senior', reputation: 324, payRate: '$24/hr' },
] 

export default () => {
  const Members = members.map(member => <TableRowMember key={member.accountAddress} {...member} />)

  return (
    <Table header={Header}>
      {Members}
    </Table>
  )
}
