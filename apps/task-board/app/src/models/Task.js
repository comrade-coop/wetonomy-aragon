class Task {
  constructor(id, workField, heading, description, project, tags, difficulty, column = 0, tokens = 0, date = 0, synced = false) {
    this.id = id
    this.workField = workField
    this.heading = heading
    this.description = description
    this.project = project
    this.tags = tags
    this.difficulty = difficulty
    this.column = column
    this.date = date
    this.tokens = tokens
    this.synced = synced
  }
  set workField(workField) {
    this._workField = workField
  }

  get workField() {
    return this._workField
  }
  set heading(heading) {
    this._heading = heading
  }
  get heading() {
    return this._heading
  }
  
  set description(description) {
    this._description = description
  }

  get description() {
    return this._description
  }

  set project(project) {
    if (!Task.isValidProject(project)) {
      throw new Error('Invalid Project')
    }

    this._project = project
  }

  get project() {
    return this._project
  }

  set tags(tags) {
    this._tags = tags
  }

  get tags() {
    return this._tags
  }
  set difficulty(difficulty) {
    this._difficulty = difficulty
  }

  get difficulty() {
    return this._difficulty
  }
  set column(column) {
    this._column = column
  }

  get column() {
    return this._column
  }
  static isValidProject(name) {
    return name.length > 0;
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

export default Task