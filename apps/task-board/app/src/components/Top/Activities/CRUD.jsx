import React from 'react'
// import PropTypes from 'prop-types'
import { Text, theme } from '@aragon/ui'
import { DIFFICULTIES, DELETE_TYPE, TASK_TYPES } from '../../../utils/appConstants'
import { Reward, Left, Content, Difficulty, Context, DeleteIcon } from './Contribute'
import removeLogo from '../../../assets/delete.svg'

const getIcon = (type) => {
  switch (type) {
    case TASK_TYPES.NEW:
      return <i style={{ fontSize: '20px', marginTop: '5px' }} className="fas fa-plus"></i>
    case TASK_TYPES.DELETED:
      return <i style={{ fontSize: '20px', marginTop: '5px' }} className="fas fa-trash-alt"></i>
    default:
      return <i style={{ fontSize: '20px', marginTop: '5px' }} className="fas fa-pencil-alt"></i>
  }
}
const getActivity = (type) => {
  switch (type) {
    case TASK_TYPES.NEW:
      return 'Add'
    case TASK_TYPES.DELETED:
      return 'Delete'
    default:
      return 'Edit'
  }
}
const CRUD = (props) => {
  return (
    <Reward className="star">
      <Left>
        {getIcon(props.task.type)}
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
            <Text color={theme.accent} >Activity:</Text>
            <Text color={theme.accent} weight="bold"> {getActivity(props.task.type)} </Text>
          </Context>
        </Difficulty>
        <DeleteIcon className="parent" src={removeLogo} alt="Remove Member"
          onClick={() => props.onDelete(props.task, DELETE_TYPE.REMOVE_CRUD)} />
      </Content>
    </Reward>
  )
}

export default CRUD