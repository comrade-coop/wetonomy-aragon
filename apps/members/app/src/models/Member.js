import {isAddress} from 'web3-utils'

class Member {
  static MIN_NAME_LENGTH = 3
  static MAX_NAME_LENGTH = 30
  static EXPERIENCE_LEVELS = {
    Junior: 0,
    Intermediate: 1,
    Senior: 2,
    Expert: 3
  }
  static EXPERIENCE_LEVELS_TO_PAYRATE = [8, 12, 18, 24]

  constructor(name, address, level) {
    this.name = name
    this.address = address
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

  set address(address) {
    if (!Member.isValidAddress(address)) {
      throw new Error('Invalid address')
    }

    this._address = address
  }

  get address() {
    return this._address
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

  get levelNamed() {
    return Object.keys(Member.EXPERIENCE_LEVELS)[this.level]
  }

  get payRate() {
    return Member.EXPERIENCE_LEVELS_TO_PAYRATE[this.level]
  }

  static isValidName(name) {
    return name.length >= Member.MIN_NAME_LENGTH && name.length <= Member.MAX_NAME_LENGTH
  }

  static isValidAddress(address) {
    return isAddress(address)
  }

  static isValidLevel(level) {
    return level >= 0 && level <= Object
      .keys(Member.EXPERIENCE_LEVELS_TO_PAYRATE)
      .length
  }
}

export default Member