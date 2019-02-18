import Aragon, { providers } from '@aragon/client'
// import store from '../store'
// import _ from 'lodash'
let app = null
export const initializeApp = (window, subscription) => {
  app = new Aragon(new providers.WindowMessage(window))
  app.state()
    .map(state => ({ ...state }))
    .subscribe(subscription)
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

export const syncAndClaim = (hours) => {
  if(hours)
    app.trackAndClaim(hours)
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

// functions for client use not connected with the contract
export const getWeek = (current) => {
  var week = []
  // Starting Monday not Sunday 
  var first = current.getDate() - current.getDay() + 1
  current.setDate(first)
  for (var i = 0; i < 7; i++) {
    week.push(new Date(+current))
    current.setDate(current.getDate()+1)
  }
  return week
}

export const filterWork = (workedHours, days) => {
  const week = days.map(d => d.getDate())
  const month = days.map(d => d.getMonth())
  //can be provided also year check but not neccesery for now
  var filteredWorkedHours = week.map((day,i) => {
    return workedHours.filter(work => 
      ( new Date(work.date).getDate() === day && new Date(work.date).getMonth() === month[i])
    )
  })
  return filteredWorkedHours
}