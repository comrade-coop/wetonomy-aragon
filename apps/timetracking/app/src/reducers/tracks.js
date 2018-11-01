import { LOAD_FULL_STATE, WEEK_CHANGE, SELECTED_WORK, SELECTED_DAY, UPDATE_WORK,
  TRACK_WORK, DELETE_WORK, CURRENT_WEEK, LOAD_ACCOUNT, SYNC_HOURS } from '../actions/tracks'
import { getWeek, filterWork } from '../utils/api'
import { getWorkedHours } from '../utils/dummyDataProvider'
import TrackedHour from '../models/TrackedHour'
export const initialState = {
  currentUser: '',
  userTokens: {reward: 0, debt: 0},
  today: new Date(),
  days: getWeek(new Date()),
  hours: filterWork(getWorkedHours(), getWeek(new Date())),
  merged: getWorkedHours(),
  selectedWork: null,
  selectedDay: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOAD_FULL_STATE: 
      return reduceFullState(state, action.payload)  
    case LOAD_ACCOUNT: 
      return loadAccount(state, action.payload)
    case WEEK_CHANGE: 
      return weekChange(state, action.payload)
    case SELECTED_WORK: 
      return changeSelectedWork(state, action.payload)
    case SELECTED_DAY: 
      return changeSelectedDay(state, action.payload)
    case UPDATE_WORK: 
      return updateWork(state, action.payload)
    case TRACK_WORK: 
      return trackWork(state, action.payload)
    case DELETE_WORK: 
      return deleteWork(state, action.payload)
    case CURRENT_WEEK: 
      return currentWeek(state, action.payload)
    case SYNC_HOURS: 
      return syncHours(state, action.payload)
    default:
      return state
  }
}

const loadAccount = (state, payload) => {
  const nextState = { ...state, userTokens: payload }
  return nextState
}

const changeSelectedWork= (state, work) => {
  const nextState = { 
    ...state, 
    selectedWork: new TrackedHour(work.id, work.description,work.project, work.hours, work.date, work.tokens), 
    selectedDay: new Date(work.date)
  }
  return nextState
}

const changeSelectedDay= (state, day) => {
  const nextState = { ...state, selectedDay: day }
  return nextState
}

const reduceFullState = (state, contractState) => {
  const nextState = { ...state, ...contractState }
  return nextState
}
const weekChange = (state, date) => {
  const merged = state.merged
  const nextState = { ...state, today: new Date(date), days: getWeek(new Date(date)), hours: filterWork(merged, getWeek(new Date(date))) }
  return nextState
}

const currentWeek = (state) => {
  const merged = state.merged
  const nextState = { ...state, today: new Date(), days: getWeek(new Date()), hours: filterWork(merged, getWeek(new Date())) }
  return nextState
}

const trackWork = (state, payload) => {
  const merged = state.merged
  const time = state.today.getTime()
  return { ...state, merged: [payload.work, ...merged], hours: filterWork([payload.work, ...merged], getWeek(new Date(time))) }
}

const updateWork = (state, payload) => {
  console.log(payload.work)
  const hours = state.merged.map(item => {
    if (item.id !== payload.work.id) {
      // This isn't the item we care about - keep it as-is
      return item
    }
    const work = new TrackedHour(
      payload.work.id,
      payload.work.description,
      payload.work.project,
      payload.work.hours,
      payload.work.date,
      payload.work.tokens
    )
    return work
  })
  const merged = [].concat.apply([], hours)
  const time = state.today.getTime()
  return { ...state, hours: filterWork(merged, getWeek(new Date(time))), merged: merged }
}

const syncHours = (state) => {
  let merged = [].concat.apply([], state.hours)
  const hours = merged.map(item => {
    const work = new TrackedHour(
      item.id,
      item.description,
      item.project,
      item.hours,
      item.date,
      item.tokens,
      true
    )
    return work
  })
  merged = [].concat.apply([], hours)
  const time = state.today.getTime()
  return { ...state, hours: filterWork(merged, getWeek(new Date(time))), merged: merged }
}

const deleteWork = (state, payload) => {
  
  const index = state.merged.indexOf(
    state.merged.find(track => track.id === payload.work.id)
  )
  console.log(index)
  const merged = [...state.merged.slice(0, index), ...state.merged.slice(index + 1)]
  const time = state.today.getTime()
  console.log(merged)
  return {
    ...state,
    merged: merged,
    hours: filterWork(merged, getWeek(new Date(time)))
  }
}