class TrackedHour {
  static MIN_NAME_LENGTH = 3
  static MAX_NAME_LENGTH = 30
  
  constructor(id ,description, project, hours, date, tokens = 0, synced = false) {
    this.id = id
    this.description = description
    this.project = project
    this.hours = hours
    this.date = date
    this.tokens = tokens
    this.synced = synced
  }

  set description(description) {
    this._description = description
  }

  get description() {
    return this._description
  }

  set project(project) {
    if (!TrackedHour.isValidProject(project)) {
      throw new Error('Invalid Project')
    }

    this._project = project
  }

  get project() {
    return this._project
  }

  set hours(hours) {
    if (!TrackedHour.isValidHours(hours)) {
      throw new Error('Invalid Worked Hours')
    }

    this._hours = hours
  }

  get hours() {
    return this._hours
  }

  static isValidProject(name) {
    return name.length > 0
  }

  static isValidHours(hours) {
    return hours > 0
  }
  set date(date) {
    this._date = date
  }

  get date() {
    return this._date
  }

  set id(id) {
    this._id = id
  }

  get id() {
    return this._id
  }
  set tokens(tokens) {
    this._tokens = tokens
  }

  get tokens() {
    return this._tokens
  }
}

export default TrackedHour