import * as Member from '../models/Member'
import _ from 'lodash'

export const getMembers = (count) => {
  const members = _.range(0, count).map(index => {
    return Member.create(
      Math.random().toString(36).slice(2),
      `0x000000000000000000000000000000000000000${index % 10}`,
      Member.EXPERIENCE_LEVELS[index % Member.EXPERIENCE_LEVELS.length],
      index,
      index)
  })
  console.log(members)
  return members
}

