import {
  LOAD_FULL_STATE,
  RELOAD_FULL_STATE,
  ADD_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
  ACCEPT_TASK,
  FINISH_TASK,
  RELOAD_TASK,
  MOVE_TASK,
  REWARD_TASK,
  ERROR_TASK,
  CLEAR_ERROR,
  LOAD_ACCOUNT
} from '../actions/tasks'
// import { TASKS } from '../utils/dummyDataProvider'
import Task from '../models/Task'
import { TASK_TYPES } from '../utils/appConstants'

export const initialState = {
  tasks: [],
  realTasks: [],
  currentTask: null,
  currentUser: '',
  errors: [],
  userTokens: {reward: 0, dao: 0}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FULL_STATE:
      return reduceFullState(state, action.payload)
    case LOAD_ACCOUNT:
      return loadAccount(state, action.payload)
    case RELOAD_FULL_STATE:
      return reloadFullState(state)
    case ADD_TASK:
      return addTask(state, action.payload)
    case REMOVE_TASK:
      return removeTask(state, action.payload)
    case UPDATE_TASK:
      return updateTask(state, action.payload)
    case ACCEPT_TASK:
      return acceptTask(state, action.payload)
    case FINISH_TASK:
      return finishTask(state, action.payload)
    case RELOAD_TASK:
      return reloadTask(state, action.payload)
    case MOVE_TASK:
      return moveTask(state, action.payload)
    case REWARD_TASK:
      return rewardTask(state, action.payload)
    case ERROR_TASK:
      return errorTask(state, action.payload)
    case CLEAR_ERROR:
      return clearError(state, action.payload)
    default:
      return state
  }
}

const loadAccount = (state, payload) => {
  console.log(payload)
  return { ...state, userTokens: payload.account, currentUser: payload.user }
}

const reduceFullState = (state, contractState) => {
  if (contractState.tasks)
    contractState.tasks = contractState.tasks.map(
      task =>
        new Task(
          task._id,
          task._workField,
          task._heading,
          task._description,
          task._project,
          task._tags,
          task._difficulty,
          task._column,
          task._tokens,
          task._assignee,
          task._issuer,
          TASK_TYPES.BASE,
          task._date
        )
    )
  else contractState.tasks = []
  var realTasks = contractState.tasks
  const nextState = { ...state, ...contractState, realTasks }
  return nextState
}

const reloadFullState = state => {
  const nextState = { ...state, tasks: state.realTasks }
  return nextState
}

const acceptTask = (state, payload) => {
  var newTasks = state.tasks.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    var task = new Task(
      item._id,
      item._workField,
      item._heading,
      item._description,
      item._project,
      item._tags,
      item._difficulty,
      parseInt(payload.stage), //updating column
      item._tokens,
      state.currentUser, //updating assignee
      item._issuer
    )
    return task
  })
  return { ...state, tasks: [...newTasks] }
}

const addTask = (state, payload) => {
  return { ...state, tasks: [payload.task, ...state.tasks] }
}
const removeTask = (state, payload) => {
  const tasks = state.tasks.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    var task = new Task(
      item._id,
      item._workField,
      item._heading,
      item._description,
      item._project,
      item._tags,
      item._difficulty,
      item._column,
      item._tokens,
      item._assignee,
      item._issuer,
      TASK_TYPES.DELETED
    )
    return task
  })
  return { ...state, tasks }
}

const updateTask = (state, payload) => {
  const tasks = state.tasks.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    const task = new Task(
      payload.task._id,
      payload.task._workField,
      payload.task._heading,
      payload.task._description,
      payload.task._project,
      payload.task._tags,
      payload.task._difficulty,
      payload.task._column,
      payload.task._tokens,
      payload.task._assignee,
      payload.task._issuer
    )
    return task
  })
  return { ...state, tasks }
}

const finishTask = (state, payload) => {
  var newTasks = state.tasks.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    var task = new Task(
      item._id,
      item._workField,
      item._heading,
      item._description,
      item._project,
      item._tags,
      item._difficulty,
      3, //updating column
      item._tokens,
      state.currentUser,
      item._issuer
    )
    return task
  })
  return { ...state, tasks: [...newTasks] }
}
const reloadTask = (state, payload) => {
  if (payload.task.type !== TASK_TYPES.NEW) {
    const task = state.realTasks.filter(task => task.id === payload.task.id)[0]
    var newTasks = state.tasks.map(item => {
      if (item.id !== payload.task.id) {
        // This isn't the item we care about - keep it as-is
        return item
      }
      return task
    })
    return { ...state, tasks: [...newTasks] }
  } else {
    const index = state.tasks.indexOf(
      state.tasks.filter(task => task.id === payload.task.id)[0]
    )
    return {
      ...state,
      tasks: [...state.tasks.slice(0, index), ...state.tasks.slice(index + 1)]
    }
  }
}
const moveTask = (state, payload) => {
  var newTasks = state.tasks.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    var task = new Task(
      item._id,
      item._workField,
      item._heading,
      item._description,
      item._project,
      item._tags,
      item._difficulty,
      parseInt(payload.stage), //updating column
      item._tokens,
      item.assignee,
      item._issuer
    )
    if (task.column === 0) task.assignee = null
    return task
  })
  return { ...state, tasks: [...newTasks] }
}

const rewardTask = (state, payload) => {
  var newTasks = state.tasks.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    var task = new Task(
      item._id,
      item._workField,
      item._heading,
      item._description,
      item._project,
      item._tags,
      item._difficulty,
      4, //updating column
      item._tokens,
      state.currentUser,
      item._issuer
    )
    return task
  })
  return { ...state, tasks: [...newTasks] }
}
const errorTask = (state, payload) => {
  var check = false
  var errors = state.errors.map(item => {
    if (item.id !== payload.task.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    check = true
    return {
      id: payload.task.id,
      error: payload.error
    }
  })
  if (!check) {
    return {
      ...state,
      errors: [{ id: payload.task.id, error: payload.error }, ...state.errors]
    }
  }
  return { ...state, errors }
}
const clearError = (state, payload) => {
  const index = state.errors.indexOf(
    state.errors.filter(error => error.id === payload.task.id)[0]
  )
  return {
    ...state,
    errors: [...state.errors.slice(0, index), ...state.errors.slice(index + 1)]
  }
}
