import { isAddress } from 'web3-utils'

export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 30
export const ID_UNEXISTENT = -1
export const EXPERIENCE_LEVELS = [
  { title: 'Junior', value: 1, payRate: 8 },
  { title: 'Intermediate', value: 2, payRate: 12 },
  { title: 'Senior', value: 3, payRate: 18 },
  { title: 'Expert', value: 4, payRate: 24 },
]

export const isValidName = name =>
  (name.length >= MIN_NAME_LENGTH) && (name.length <= MAX_NAME_LENGTH)

export const isValidAddress = address =>
  isAddress(address)

export const isValidLevel = validatedLevel => {
  const level = EXPERIENCE_LEVELS.find(level => 
    level.value === validatedLevel.value &&
    level.payRate === validatedLevel.payRate &&
    level.title === validatedLevel.title)
  return level !== undefined
}

export const getLevelForLevelValue = levelValue => {
  return EXPERIENCE_LEVELS.find(level => level.value === levelValue)
}

export const isValidReputation = reputation => reputation >= 0

export const isValidMember = member => {
  try {
    validateMember(member.name, member.address, member.level)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

export const levelEquals = (firstLevel, secondLevel) => {
  return firstLevel.title === secondLevel.title &&
    firstLevel.value === secondLevel.value &&
    firstLevel.payRate === secondLevel.payRate 
}

const validateMember = (name, address, level, reputation = 0) => {
  if (!isValidName(name)) {
    throw new Error ('Invalid name')
  }

  if (!isValidAddress(address)) {
    throw new Error ('Invalid address')
  }

  if (!isValidLevel(level)) {
    throw new Error ('Invalid Level')
  }

  if (!isValidReputation(reputation)) {
    throw new Error('Invalid reputation')
  }
}

export const areEqual = (firstMember, secondMember) => 
  firstMember.name === secondMember.name &&
  firstMember.address === secondMember.address &&
  levelEquals(firstMember.level, secondMember.level)

export const create = (name, address, level, reputation = 0, id = ID_UNEXISTENT) => {  
  validateMember(name, address, level, reputation)

  return Object.freeze({
    id,
    name,
    address,
    reputation,
    level
  })
}
