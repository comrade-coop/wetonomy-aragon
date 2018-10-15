import React from 'react'
// import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Text, Badge, theme } from '@aragon/ui'
import { DIFFICULTIES, WORK_FIELD, TASK_TYPES } from '../../utils/appConstants'
import editLogo from '../../assets/edit.svg'
import Avatar from '../Top/Avatar'

const getTags = task => {
  return task.tags.map(tag => (
    <NewTag key={task.tags.indexOf(tag)} name={tag} />
  ))
}

const NewTag = props => {
  return <Tag>{props.name}</Tag>
}

const assignee = (user, props) => {
  if (props.task.column === 3 && user === props.task.issuer) {
    return (
      <Finish onClick={props.onRewardTask} style={{ background: '#9c55ebe3' }}>
        Reward
      </Finish>
    )
  }
  if (user === props.task.assignee && props.task.column < 3) {
    return <Finish onClick={props.onFinishTask}>Finish</Finish>
  }
  return (
    <UserAvatar>
      <Avatar seed={props.task.assignee} />
    </UserAvatar>
  )
}

const getBackground = props => {
  switch (props.task.type) {
    case TASK_TYPES.NEW:
      return props.error
        ? { background: 'rgb(76, 175, 80)' }
        : { background: 'rgba(231, 255, 213, 0.3)' }
    case TASK_TYPES.DELETED:
      return props.error
        ? { background: 'rgb(251, 121, 121)' }
        : { background: 'rgba(255, 200, 179, 0.3)' }
    case TASK_TYPES.BASE:
    default:
      return { background: 'rgb(255,255,255,0.9)' }
  }
}

const getErrorMsg = error => {
  if (error) {
    return error.error
  }
  return null
}

const Task = props => (
  <TaskHolder
    draggable="true"
    onDragStart={event => props.drag(event)}
    onDragEnd={event => props.dragEnd(event)}
    // onClick = {props.handleTaskPanelToggle}
    id={'task' + props.task.id}>
    {props.error || props.task.type ? (
      <Fade onClick={props.clearError} style={getBackground(props)}>
        <Error style={getBackground(props)}>
          <Text
            color={props.task.type === TASK_TYPES.BASE ? '#d01b1b' : 'white'}
            size="xlarge">
            {getErrorMsg(props.error)}
          </Text>
        </Error>
      </Fade>
    ) : (
      ''
    )}
    <Text size="small" weight="bold">
      {WORK_FIELD[props.task.workField]}
    </Text>
    <Icon
      src={editLogo}
      alt="Edit Task"
      onClick={() => props.onEditTaskClick(props.task)}
    />
    <Tags>
      <Tag background="#5ae39d" foreground="white">
        {props.task.project}
      </Tag>
      {getTags(props.task)}
    </Tags>
    <Description>
      <Text size="normal">
        {props.task.heading.length > 35
          ? props.task.heading.substring(0, 35) + ' ...'
          : props.task.heading}
      </Text>
    </Description>
    <Difficulty>
      <Text color={theme.textSecondary}>Difficulty: </Text>
      <Text color={theme.textSecondary} weight="bold">
        {DIFFICULTIES[props.task.difficulty]}
      </Text>
    </Difficulty>
    <Reward>
      <Text color={theme.textSecondary}>Reward so far: </Text>
      <Text color={theme.accent} weight="bold">
        {props.task.tokens} DAO Tekens
      </Text>
    </Reward>
    <Actions>
      <NotPriority className="star" id={'star' + props.task.id}>
        {props.points === 0 ? (
          <i className="material-icons">star_border</i>
        ) : (
          props.points
        )}
      </NotPriority>
      <Absolut className="parent">
        <Div>
          <TopContainer onMouseLeave={props.onMouseLeave}>
            <Priority className="pooints" onClick={() => props.onOpenClick(10)}>
              10
            </Priority>
            <Priority className="pooints" onClick={() => props.onOpenClick(20)}>
              20
            </Priority>
            <Priority className="pooints" onClick={() => props.onOpenClick(30)}>
              30
            </Priority>
            <Priority className="pooints" onClick={() => props.onOpenClick(40)}>
              40
            </Priority>
            <Priority className="pooints" onClick={() => props.onOpenClick(50)}>
              50
            </Priority>
          </TopContainer>
        </Div>
      </Absolut>
      {props.task.assignee === null ? (
        <Accept onClick={props.onAcceptTask}>Accept Task</Accept>
      ) : (
        assignee(props.user, props)
      )}
    </Actions>
  </TaskHolder>
)

const Fade = styled.div`
  position: absolute;
  background: rgb(255, 255, 255, 0.9);
  width: 100%;
  height: 100%;
  z-index: 3;
  top: 0;
  left: 0;
`
const Error = styled.div`
  text-align: center;
  margin-top: 80px;
  background: white;
  font-weight: 600;
`
const Absolut = styled.div`
  position: absolute;
  top: -0;
`
const Div = styled.div`
  z-index: 1;
  position: relative;
  background: white;
  height: 30px;
  width: 200px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  border-radius: 50px;
  padding-right: 4px;
  display: inline-block;
`
const TopContainer = styled.div`
  display: flex;
  padding-left: 32px;
`
const TaskHolder = styled.div`
  position: relative;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  padding: 10px;
  cursor: pointer;
  border-radius: 3px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
  }
`
const Icon = styled.img`
  cursor: pointer;
  float: right;
`
const Description = styled.div`
  margin: 5px 0 5px 0;
`
const Tags = styled.div`
  margin: 0 8px 0 0;
`
const Difficulty = styled.div`
  font-size: 14px;
`
const Reward = styled.div`
  font-size: 14px;
`
const Actions = styled.div`
  margin-top: 10px;
  position: relative;
`
const Accept = styled.div`
  height: 30px;
  color: white;
  text-align: center;
  width: 80px;
  padding: 5px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: inline-block;
  float: right;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
  }
`
const Finish = styled.div`
  height: 26px;
  color: white;
  text-align: center;
  width: 60px;
  padding: 3px;
  cursor: pointer;
  border-radius: 3px;
  font-size: 12px;
  display: inline-block;
  float: right;
  margin-top: 4px;
  background: #5ae39d;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
  }
`
const NotPriority = styled.div`
  height: 30px;
  width: 30px;
  color: #00b4e6;
  text-align: center;
  padding-top: 3px;
  cursor: pointer;
  border-radius: 30px;
  font-size: 15px;
  font-weight: 600;
  display: inline-block;
  position: relative;
  z-index: 2;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
  }
`
const Priority = styled.div`
  height: 26px;
  width: 26px;
  color: #fff;
  text-align: center;
  padding-top: 2px;
  cursor: pointer;
  border-radius: 30px;
  font-size: 15px;
  margin: 2px 0 2px 6px;
  font-weight: 600;
  display: inline-block;
  position: relative;
  z-index: 2;
  background-image: linear-gradient(130deg, #00b4e6, #00f0e0);
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.16), 0 0 2px rgba(0, 0, 0, 0.23);
  :hover {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.26), 0 0 5px rgba(0, 0, 0, 0.33);
    -webkit-transition: all 1s ease-in-out;
  }
`
const Tag = styled(Badge)`
  margin-left: 8px;
  padding: 1px 14px 1px 14px;
  :first-child {
    margin-left: 0px;
  }
`

const UserAvatar = styled.div`
  position: absolute;
  right: 5px;
  bottom: 0px;
`

export default Task
