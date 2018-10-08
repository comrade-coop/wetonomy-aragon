import React from 'react'
// import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import { DIFFICULTIES, COLUMNS, DELETE_TYPE } from '../../../utils/appConstants'
import { Reward, Left, Content, Difficulty, Context, DeleteIcon } from './Contribute'
import removeLogo from '../../../assets/delete.svg'

const ChangeStage = (props) => {
  return (
    <Reward className="star">
      <Left>
        <i style={{ fontSize: '20px', marginTop: '5px' }} className="fas fa-exchange-alt"></i>
      </Left>
      <Content>
        <Text color={theme.textSecondary}>
          {props.task.heading.length > 35? props.task.heading.substring(0, 25) + ' ...' : props.task.heading}
        </Text>
        <Difficulty>
          <Context>
            <Text color={theme.textTertiary} >Difficulty: </Text>
            <Text color={theme.textTertiary} weight="bold">{DIFFICULTIES[props.task.difficulty]}</Text>
          </Context>
          <Context>
            <Text color={theme.accent} >State:</Text>
            <Text color={theme.accent} weight="bold"> {COLUMNS[props.task.column]} </Text>
          </Context>
        </Difficulty>
        <DeleteIcon className="parent" src={removeLogo} alt="Remove Member"
          onClick={() => props.onDelete(props.task, DELETE_TYPE.REMOVE_STAGE_CHANGE)} />
      </Content>
    </Reward>
  )
}

export default ChangeStage