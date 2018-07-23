import React from 'react'
import { TableRow, TableCell, Text } from '@aragon/ui'
import { theme } from '@aragon/ui'
import { DayWork, DayCell } from './DayWork'
import styled from 'styled-components'
export const TableRowWork = (props) => {
	return (
		<TableRow>
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[1]}/>
			)}
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[2]}/>
			)}
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[3]}/>
			)}
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[4]}/>
			)}
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[5]}/>
			)}
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[6]}/>
			)}
			{props.workedHours==undefined ? (<DayWork/>) : (
				<DayWork workedHours={props.workedHours[0]}/>
			)}
		</TableRow>
	)
}
