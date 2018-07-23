import TrackedHour from '../models/TrackedHour'
const organizationName = 'Comrade'
const workedHours = [
  {
    id: 1,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    project:"Wetonomy",
    hours:"4",
    tokens:"40",
    date:"Mon Jul 16 2018 17:02:34 GMT+0300"
  },
  {
    id: 2,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    project:"Skynet",
    hours:"4",
    date:"Mon Jul 23 2018 GMT+0300",
    tokens:"40",
    date:"Mon Jul 16 2018 17:02:34 GMT+0300"
  },
  {
    id: 3,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    project:"WebInvent",
    hours:"4",
    tokens:"40",
    date:"Mon Jul 22 2018 17:02:34 GMT+0300"
  }
]

export const getWorkedHours = () => {
  return new Promise((resolve) => {
    resolve(workedHours)
  })
}
