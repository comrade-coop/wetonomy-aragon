import TrackedHour from '../models/TrackedHour'
const organizationName = 'Comrade'
const workedHours = [
  {
    id: 1,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    project:"Wetonomy",
    hours:"2",
    date:"Mon Jul 23 2018 GMT+0300",
    tokens:"40",
},
  {
    id: 2,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    project:"Skynet",
    hours:"4",
    date:"Mon Jul 23 2018 GMT+0300",
    tokens:"40",
},
  {
    id: 3,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    project:"WebInvent",
    hours:"8",
    date:"Mon Jul 29 2018 GMT+0300",
    tokens:"40",
 }
]

const memberDebt = 1230.53
const rewardTokens = 320

export const COLORS = {
	Wetonomy: ['#00B4E6','#00F0E0'],
	Skynet:['#f52617','#ffba3b'],
	WebInvent: ['#4a2dbe','#e6a2f7']
}

export const PROJCETS = ["Wetonomy","Skynet","WebInvent"]

export const getWorkedHours = () => {
  return new Promise((resolve) => {
    resolve(workedHours)
  })
}
export const getWorkedHours2 = () => {
  return new Promise((resolve) => {
    resolve(
      workedHours.map(worked => {
        return new TrackedHour(worked.id, worked.description,worked.project, worked.hours, worked.date, worked.tokens)
      })
    )
  })
}
export const getMemberDebt = () => {
  return new Promise((resolve) => {
    resolve(memberDebt)
  })
}

export const getRewardTokens = () => {
  return new Promise((resolve) => {
    resolve(rewardTokens)
  })
}
