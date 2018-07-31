import { isAddress } from 'web3-utils'

export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 30
export const EXPERIENCE_LEVELS = {
  Junior: 0,
  Intermediate: 1,
  Senior: 2,
  Expert: 3
}
export const EXPERIENCE_LEVELS_TO_PAYRATE = [8, 12, 18, 24]
export const ID_UNEXISTANT = -1

export const isValidName = (name) => {
  return name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH
}

export const isValidAddress = (address) => {
  return isAddress(address)
}

export const isValidLevel = (level) => {
  return level >= 0 && level <= Object
    .keys(EXPERIENCE_LEVELS_TO_PAYRATE)
    .length
}

export const isValidMember = (member) => {
  try {
    validateMember(member.name, member.address, member.level)
    return true
  } catch (e) {
    console.error(e)
    return false
  }
}

const validateMember = (name, address, level) => {
  if (!isValidName(name)) {
    throw new Error ('Invalid name')
  }

  if (!isValidAddress(address)) {
    throw new Error ('Invalid address')
  }

  if (!isValidLevel(level)) {
    throw new Error ('Invalid Level')
  }
}

export default (name, address, level, id = ID_UNEXISTANT) => {  
  validateMember(name, address, level)

  return Object.freeze({
    name,
    address,
    level,
    levelNamed: Object.keys(EXPERIENCE_LEVELS)[level],
    payRate: EXPERIENCE_LEVELS_TO_PAYRATE[level],
    id
  })
}