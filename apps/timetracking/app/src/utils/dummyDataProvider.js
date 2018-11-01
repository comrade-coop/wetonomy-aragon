import TrackedHour from '../models/TrackedHour'
import * as api from './api'

const week = api.getWeek(new Date())
const workedHours = [
  {
    id: 1,
    description:'Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.',
    project:'Wetonomy',
    hours:'2',
    date: week[0],
    tokens:'40',
  },
  {
    id: 2,
    description:'Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.',
    project:'Skynet',
    hours:'4',
    date: week[2],
    tokens:'40',
  },
  {
    id: 3,
    description:'Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.',
    project:'WebInvent',
    hours:'8',
    date: week[6],
    tokens:'40',
  }
]

export const COLORS = {
  Wetonomy: ['#00B4E6','#00F0E0'],
  Skynet:['#f52617','#ffba3b'],
  WebInvent: ['#4a2dbe','#e6a2f7']
}

export const PROJECTS = ['Wetonomy','Skynet','WebInvent']

export const getWorkedHours = () => {
  return workedHours.map(worked => new TrackedHour(worked.id, worked.description,worked.project, worked.hours, worked.date, worked.tokens) )
}

