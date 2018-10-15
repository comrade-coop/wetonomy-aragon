import {
  TOGGLE_WINDOW, CONTRIBUTE_ACTIVITY, STAGE_CHANGE_ACTIVITY,
  DELETE_ACTIVITY, CREATE_ACTIVITY, REMOVE_ACTIVITY, UPDATE_ACTIVITY, CLEAR_ACTIVITY
} from '../actions/activities'
import Task from '../models/Task'
import { TASK_TYPES, DELETE_TYPE } from '../utils/appConstants'
const initialState = {
  contributions: [],
  stateChanges: [],
  crudActivity: [],
  count: 0,
  opened: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_WINDOW:
      return { ...state, opened: !state.opened }
    case CONTRIBUTE_ACTIVITY:
      return handleAddContribution(state, action.payload)
    case STAGE_CHANGE_ACTIVITY:
      return handleStateChange(state, action.payload)
    case DELETE_ACTIVITY:
      return handleDelete(state, action.payload)
    case CREATE_ACTIVITY:
      return handleCreate(state, action.payload)
    case REMOVE_ACTIVITY:
      return handleRemove(state, action.payload)
    case UPDATE_ACTIVITY:
      return handleUpdate(state, action.payload)
    case CLEAR_ACTIVITY:
      return initialState
    default:
      return state
  }
}

const handleCreate = (state, payload) => {
  return { ...state, crudActivity: [payload.task, ...state.crudActivity], count: state.count+1 }
}
const handleRemove = (state, payload) => {
  var check = false
  var newState = state
  // removing the contributions and stateChanges (if we have ones) beacouse of the delete
  if(state.contributions.filter(task => task.id === payload.task.id).length > 0) {
    newState = handleDelete(state, { type: DELETE_TYPE.REMOVE_CONTRIBUTION, task: payload.task})
  }
  if(state.stateChanges.filter(task => task.id === payload.task.id).length > 0) {
    newState = handleDelete(newState, { type: DELETE_TYPE.REMOVE_STAGE_CHANGE, task: payload.task})
  }

  var newCrudActivity = state.crudActivity.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    check = true
    var real = state.crudActivity.filter(task => task.id = payload.task.id)[0]
    console.log(real)
    const task = new Task(real._id, real._workField, real._heading, real._description, real._project,
      real._tags, real._difficulty, real._column, real._tokens, real._assignee, real._issuer, TASK_TYPES.DELETED)
    return task
  })
  if (!check) {
    const task = new Task(payload.task._id, payload.task._workField, payload.task._heading, payload.task._description, payload.task._project,
      payload.task._tags, payload.task._difficulty, payload.task._column, payload.task._tokens, payload.task._assignee, payload.task._issuer, TASK_TYPES.DELETED)
    return { ...newState, crudActivity: [task, ...state.crudActivity], count: newState.count+1 }
  }
  return { ...newState, crudActivity: [...newCrudActivity] }
}
const handleUpdate = (state, payload) => {
  var check = false
  var newCrudActivity = state.crudActivity.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    check = true
    const task = new Task(payload.task._id, payload.task._workField, payload.task._heading, payload.task._description, payload.task._project,
      payload.task._tags, payload.task._difficulty, payload.task._column, payload.task._tokens, payload.task._assignee, payload.task._issuer, TASK_TYPES.BASE)
    return task
  })
  if (!check) {
    const task = new Task(payload.task._id, payload.task._workField, payload.task._heading, payload.task._description, payload.task._project,
      payload.task._tags, payload.task._difficulty, payload.task._column, payload.task._tokens, payload.task._assignee, payload.task._issuer, TASK_TYPES.BASE)
    return { ...state, crudActivity: [task, ...state.crudActivity], count: state.count+1 }
  }
  return { ...state, crudActivity: [...newCrudActivity] }
}

const handleAddContribution = (state, payload) => {
  var check = false
  var newContributions = state.contributions.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    check = true
    var task = new Task(item._id, item._workField, item._heading, item._description, item._project, item._tags, item._difficulty, item._column, item._tokens, item._assignee, item._issuer)
    task.tokens = parseInt(task.tokens) + parseInt(payload.tokens)
    return task
  })
  console.log(check)
  if (!check) {
    var task = new Task(payload.task._id, payload.task._workField, payload.task._heading, payload.task._description, payload.task._project, payload.task._tags, payload.task._difficulty, payload.task._column, payload.task._tokens, payload.task._assignee, payload.task._issuer, payload.task._date)
    task.tokens = parseInt(payload.tokens)
    return { ...state, contributions: [task, ...state.contributions], count: state.count+1 }
  }
  return { ...state, contributions: [...newContributions] }
}

const handleStateChange = (state, payload) => {
  var check = false
  var newStateChanges = state.stateChanges.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    check = true
    var task = new Task(item._id, item._workField, item._heading, item._description, item._project, item._tags, item._difficulty, item._column, item._tokens, item._assignee, item._issuer)
    task.column = payload.stage
    return task
  })
  if (!check) {
    var task = new Task(payload.task._id, payload.task._workField, payload.task._heading, payload.task._description, payload.task._project, payload.task._tags, payload.task._difficulty, payload.task._column, payload.task._tokens, payload.task._assignee, payload.task._issuer, payload.task._date)
    task.column = payload.stage
    return { ...state, stateChanges: [task, ...state.stateChanges], count: state.count+1 }
  }
  return { ...state, stateChanges: [...newStateChanges] }
}

const handleDelete = (state, payload) => {
  const index = state[payload.type].indexOf(state[payload.type].filter(task => task.id === payload.task.id)[0])
  return {
    ...state, [payload.type]: [...state[payload.type].slice(0, index),
      ...state[payload.type].slice(index + 1)], count: state.count-1
  }
}