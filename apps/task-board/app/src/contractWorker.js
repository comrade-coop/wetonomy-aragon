import Aragon from '@aragon/client'
import _ from 'lodash'
import Task from './models/Task'
import { TASKS } from './utils/dummyDataProvider'

const app = new Aragon()

app.store(async (state, {event, returnValues}) => {
  switch (event) {
    case 'TaskIssued':
      return await onTaskAdd(event, returnValues)
    case 'ContributionAdded':
      return await onContribution(event, returnValues)
    case 'TaskAssigned':
      return await onTaskAssigned(state, returnValues)
    case 'TaskStageChange':
      return await onTaskStageChange(event, state, returnValues)
    default:
      return log(event,state,returnValues)
  }
})


/***********************
 * Event Handlers      *
 ***********************/



/***********************
 * Read Handles        *
 ***********************/
const loadCompleteState = async() => {
  const tasks = await loadTasks()
  const currentUser = await loadCurrentAccount()

  const balance = await loadCurrentBalance(currentUser)
  return { tasks, balance, currentUser}
}

const onTaskAdd = async (event, returnValues) => {
  console.log(event, returnValues)
  const newState = await loadCompleteState()
  console.log(newState)
  return newState
}

const onContribution = async (event, returnValues) => {
  console.log(event, returnValues)
  const newState = await loadCompleteState()
  const updatedTask = await loadTask(returnValues.taskId)

  const nextState = {
    ...newState,
    updatedTask
  }
  console.log(nextState)
  return nextState
}

const onTaskStageChange = async (event, state, returnValues) => {
  console.log(event, returnValues)
  var nextState = state
  // if(returnValues.stage >= 3) {
  const newState = await loadCompleteState()
  const updatedTask = await loadTask(returnValues.taskId)
  nextState = {
    ...newState,
    updatedTask
  }
  // }
  return nextState
}
const onTaskAssigned = async (event, returnValues) => {
  console.log(event, returnValues)
  const newState = await loadCompleteState()
  const updatedTask = await loadTask(returnValues.taskId)

  const nextState = {
    ...newState,
    updatedTask
  }
  console.log(nextState)
  return nextState
}

const log = async(event, state, returnValues) => {
  console.log('default: ', event, ':', returnValues)
  return state
}
const loadTasks = async() => {
  const count = await loadTasksCount()
  if (count === 0) {
    return []
  }
  console.log('Tasks count is: ', count)
  const tasks = await Promise.all(_.range(0, count).map(async index => await loadTask(index)))
  return tasks
}
const loadTasksCount = async() => {
  const countResult = await callReadMethod('getTasksCount')
  const count = parseInt(countResult)
  return count
}
const loadTask = async(id) => {
  const taskResult = await callReadMethod('getTask', id)
  const demo = TASKS[0]
  let task
  try {
    const assignee = (taskResult.assignee == '0x0000000000000000000000000000000000000000'? null: taskResult.assignee)
    task = new Task(id, demo.workField, demo.description, demo.heading, demo.project, ['front-end','tag'], 1, parseInt(taskResult.taskStage), taskResult.balance, assignee, taskResult.issuer)
  } catch (error) {
    console.log('Wrong arguments for task:', error.message)
  }
  //(address issuer, uint balance, uint taskStage, bytes data, address assignee)
  return task
}
const loadCurrentBalance = async(from) => {
  const balanceResult = await callReadMethod('getAccount', from)
  console.log('getBalance', balanceResult)
  const balance = parseInt(balanceResult[0])
  return balance
}
const loadCurrentAccount = () => {
  return new Promise((resolve, reject) => {
    try {
      app.accounts().subscribe(accounts => {
        console.log('Accounts: ', accounts)
        const currentAccount = accounts[0]
        if (currentAccount) {
          resolve(currentAccount)
        } else {
          reject('A valid account address wasn\'t found')
        }

      })
    } catch (error) {
      reject(error)
    }
  })
}

const callReadMethod = (method, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      app
        .call(method, ...args)
        .first()
        .subscribe(result => {
          resolve(result)
        })
    } catch (error) {
      reject(error)
    }
  })
}