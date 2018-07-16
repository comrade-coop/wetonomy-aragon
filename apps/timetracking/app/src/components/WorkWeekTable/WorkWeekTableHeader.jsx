import React from 'react';
import {TableRow, Text} from '@aragon/ui'
import {theme} from '@aragon/ui'
import styled from 'styled-components'
export const WorkWeekTableHeader = (props) => {
    return (
      <TableRow>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[0]}.Monday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[1]}h - {props.tokens[1]} Tokens </Text>
        </HeaderDayCell>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[1]}.Tuesday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[2]}h - {props.tokens[2]} Tokens </Text>
        </HeaderDayCell>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[2]}.Wednesday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[3]}h - {props.tokens[3]} Tokens </Text>
        </HeaderDayCell>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[3]}.Thursday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[4]}h - {props.tokens[4]} Tokens </Text>
        </HeaderDayCell>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[4]}.Friday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[5]}h - {props.tokens[5]} Tokens </Text>
        </HeaderDayCell>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[5]}.Saturday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[6]}h - {props.tokens[6]} Tokens </Text>
        </HeaderDayCell>
        <HeaderDayCell>
          <Text size="xlarge" color={theme.textDimmed}>{props.day[6]}.Sunday</Text><br/>
          <Text size="xlarge" color={theme.textTertiary}>{props.hours[0]}h - {props.tokens[0]} Tokens </Text>
        </HeaderDayCell>
      </TableRow>
    )
  }
const HeaderDayCell = styled.td`
  border: 1px solid #E6E6E6;
  padding: 20px;
  text-align: left;
  :first-child { 
    border-radius: 5px 0 0 0;
  }
  :last-child { 
    border-radius: 0 5px 0 0;
  }
`