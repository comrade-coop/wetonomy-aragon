import Aragon, { providers } from '@aragon/client'
import Task from '../models/Task'
import { getBytes32FromMultiash } from './multihash'
import { TASK_TYPES } from './appConstants'
import IMembers from '../assets/IMembers.json'

let app = null
let members = null

export const initializeApp = (window, subscription) => {
  app = new Aragon(new providers.WindowMessage(window))
  app.state()
    .map(state => ({ ...state }))
    .subscribe(subscription)
}
export const loadMember = async(member) =>{
  app.call('members').subscribe(result => {
    // console.log(result)
    // console.log([IMembers])
    members = app.external(result,IMembers.abi)
    members.getMemberByAddress(member).subscribe(obj => console.log(obj))
    
  })
  
}
export const callReadMethod = (method, ...args) => {
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
export const loadCurrentAccount = async() => {
  return new Promise((resolve, reject) => {
    try {
      app.accounts().subscribe(accounts => {
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

export const addTask = async (task) => {
  if (Task.isValidTask(task)) {
    const issuer = await loadCurrentAccount()
    app.issueTask(issuer,'0x7c4bc6d00000000000000000000000000000000000000000000000000000000000000004',40,'0xb4124ceb3451635dacedd11767f004d8a28c6ee7')
  }
}

export const syncActivities = (activities) => {
  // syncCreateActivities(activities)
  // syncDeleteActivities(activities)
  // syncEditActivities(activities)
  // syncContributeActivities(activities)
  encodeActivities(activities)
}
export const encodeActivities = async (activities) => {
  const issuer = await loadCurrentAccount()
  let iaa = [issuer]
  let ia = []
  let hs = []
  let digest = []
  ia.push(activities.crudActivity.filter((task) => task.type === TASK_TYPES.NEW).length)
  activities.crudActivity.forEach((task) => {
    if (task.type === TASK_TYPES.NEW) {
      iaa.push(issuer)
      iaa.push('0x0')
      const data = getBytes32FromMultiash('QmejGNNbBk62b51KVXCYNJKjPnhx7t6BckAzicSqKKqRtE')
      digest.push(data.digest)
      hs.push(data.hashFunction)
      hs.push(data.size)
      ia.push(task.tokens)
    }
  })
  ia.push(activities.crudActivity.filter((task) => task.type === TASK_TYPES.BASE).length)
  activities.crudActivity.forEach((task) => {
    if (task.type === TASK_TYPES.BASE) {
      const data = getBytes32FromMultiash('QmejGNNbBk62b51KVXCYNJKjPnhx7t6BckAzicSqKKqRtE')
      digest.push(data.digest)
      ia.push(task.id)
      hs.push(data.hashFunction)
      hs.push(data.size)
    }
  })
  ia.push(activities.crudActivity.filter((task) => task.type === TASK_TYPES.DELETED).length)
  activities.crudActivity.forEach((task) => {
    if (task.type === TASK_TYPES.DELETED) {
      ia.push(task.id)
    }
  })
  ia.push(activities.contributions.length)
  activities.contributions.forEach((task) => {
    ia.push(task.id)
    ia.push(task.tokens)
  })
  ia.push(activities.stateChanges.length)
  activities.stateChanges.forEach((task) => {
    ia.push(task.id)
    hs.push(parseInt(task.column))
  })
  console.log(iaa, ia, hs, digest)
  app.sync(iaa, ia, hs, digest)
}
export const syncCreateActivities = async(activities) => {
  const issuer = await loadCurrentAccount()
  const data = activities.crudActivity.map(() => getBytes32FromMultiash('QmejGNNbBk62b51KVXCYNJKjPnhx7t6BckAzicSqKKqRtE'))
  const digest = data.map(d => d.digest)
  const hashFunction = data.map(d => d.hashFunction)
  const size = data.map(d => d.size)
  // TODO REMOVE
  const arbiter = activities.crudActivity.map(() => '0xb4124ceb3451635dacedd11767f004d8a28c6ee7')
  const balance = activities.crudActivity.map(task => task.tokens)
  app.issueMultipleTasks(issuer, digest, hashFunction, size, arbiter, balance)
}

export const syncDeleteActivities = (activities) => {
  const ids = activities.crudActivity.map(task => task.id)
  console.log(ids)
  app.killMultipleTask(ids)
}

export const syncEditActivities = (activities) => {
  const ids = activities.crudActivity.map(task => task.id)
  const data = activities.crudActivity.map(() => getBytes32FromMultiash('QmejGNNbBk62b51KVXCYNJKjPnhx7t6BckAzicSqKKqRtE'))
  const digest = data.map(d => d.digest)
  const hashFunction = data.map(d => d.hashFunction)
  const size = data.map(d => d.size)
  console.log(ids, digest, hashFunction, size)
  app.changeMultipleTaskData(ids, digest, hashFunction, size)
}

export const syncContributeActivities = (activities) => {
  const ids = activities.contributions.map(task => task.id)
  const tokens = activities.contributions.map(task => task.tokens)
  app.multipleContribute(ids, tokens)
}

export const updateTask = (oldTask, newTask) => {
  if (!Task.isValidTask(newTask) || Task.equals(oldTask, newTask)) {
    const taskId = oldTask.id
    app.updateTask(
      taskId,
      newTask.address,
      newTask.name,
      newTask.level
    )
  }
}

export const removeTask = task => {
  if (Task.isValidTask(task)) {
    app.removeTask(task.id)
  }
}

export const contributeTokens = (task, tokens) => {
  if (Task.isValidTask(task)) {
    app.contribute(parseInt(task.id), parseInt(tokens))
  }
}

export const acceptTask = async(task) => {
  const user = await loadCurrentAccount()
  if (Task.isValidTask(task)) {
    app.assignTask(task.id, user)
  }
}

export const finishTask = task => {
  if (Task.isValidTask(task)) {
    app.moveTaskForReview(task.id)
  }
}

export const rewardTask = task => {
  if (Task.isValidTask(task)) {
    app.giveReward(task.id)
  }
}

export const moveTask = (task, column) => {
  if (Task.isValidTask(task)) {
    console.log(column)
    app.transitionToState(task.id, column)
  }
}