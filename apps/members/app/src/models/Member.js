import {isAddress} from 'web3-utils'
import {MIN_NAME_LENGTH, MAX_NAME_LENGTH, MEMBER_EXPERIENCE_LEVELS, getMemberPayRate} from '../utils/appConstants'

class Member {
  constructor(name, accountAddress, level) {
    this.name = name
    this.accountAddress = accountAddress
    this.level = level
  }

  set name(name) {
    if (!Member.isValidName(name)) {
      throw new Error('Invalid name')
    }

    this._name = name
  }

  get name() {
    return this._name
  }

  set accountAddress(address) {
    if (!Member.isValidAddress(address)) {
      throw new Error('Invalid address')
    }

    this._accountAddress = address
  }

  get accountAddress() {
    return this._accountAddress
  }

  set level(level) {
    if (!Member.isValidLevel(level)) {
      throw new Error('Invalid Experience Level')
    }

    this._level = level
  }

  get level() {
    return this._level
  }

  get payRate() {
    return getMemberPayRate(this.level)
  }

  static isValidName(name) {
    return name.length >= MIN_NAME_LENGTH && name.length <= MAX_NAME_LENGTH
  }

  static isValidAddress(address) {
    return isAddress(address)
  }

  static isValidLevel(level) {    
    return level >= 0 && level <= Object.keys(MEMBER_EXPERIENCE_LEVELS).length
  }
}

export default Member