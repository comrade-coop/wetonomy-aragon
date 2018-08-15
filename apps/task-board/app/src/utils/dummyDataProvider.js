import Task from '../models/Task'
const organizationName = 'Comrade'
const tasks = [
  {
    id: 1,
    workField: 1,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    heading: "Build a script to speed up Aragon build time.Build a script to speed up Aragon build time.Build a script to speed up Aragon build time.",
    project:"Wetonomy",
    tags: ["front-end","tag"],
    column: 0,
    difficulty: 2,
    isPriority: true,
    tokens:"40",
  },
  {
    id: 2,
    workField: 0,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    heading: "Build a script to speed up Aragon build time.",
    project:"Wetonomy",
    tags: ["front-end","tag"],
    column: 0,
    difficulty: 1,
    isPriority: true,
    tokens:"40",
  },
  {
    id: 3,
    workField: 2,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    heading: "Build a script to speed up Aragon build time.",
    project:"ScyNet",
    tags: ["front-end","tag"],
    column: 0,
    difficulty: 1,
    isPriority: false,
    tokens:"40",
  },
  {
    id: 4,
    workField: 3,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    heading: "Build a script to speed up Aragon build time.",
    project:"ScyNet",
    tags: ["front-end","tag"],
    column: 1,
    difficulty: 2,
    isPriority: false,
    tokens:"40",
  },
  {
    id: 5,
    workField: 1,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    heading: "Build a script to speed up Aragon build time.",
    project:"Wetonomy",
    tags: ["front-end","tag"],
    column: 2,
    difficulty: 2,
    isPriority: false,
    tokens:"40",
  },
  {
    id: 6,
    workField: 1,
    description:"Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.Worked on design Wireframes.",
    heading: "Build a script to speed up Aragon build time.",
    project:"Wetonomy",
    tags: ["front-end","tag"],
    column: 2,
    difficulty: 2,
    isPriority: true,
    tokens:"40",
  },
]

const memberDebt = 1230.53
const rewardTokens = 320

export const PROJCETS = ["Wetonomy","Skynet","WebInvent"]

export const COLUMNS = ["Unassigned","Assigned","In Progress","Review","Done"]

export const getColumns = () => {
  return new Promise((resolve) => {
    resolve(COLUMNS)
  })
}
// export const getTasks = () => {
//   return new Promise((resolve) => {
//     resolve(tasks)
//   })
// }
export const getTasks = () => {
  return new Promise((resolve) => {
    resolve(
      tasks.map(task => {
        return new Task(task.id, task.workField, task.heading, task.description,task.project, task.tags, task.difficulty, task.column,task.tokens, task.date)
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
