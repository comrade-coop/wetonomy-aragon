import Member from '../models/Member'

export const range = (size, startAt = 0) => {
  if (size === 0) {
    return []
  }
  
  return [...Array(size).keys()].map(i => i + startAt)
}

export const isMember = (member) => {
  const isMember = member instanceof Member  
  if (!isMember) {
    console.error('Expected parameter of type Member but got:', member)
  }
  return isMember
}