export const APP_NAME = 'Wetonomy Members'

export const MIN_NAME_LENGTH = 3
export const MAX_NAME_LENGTH = 30

export const MEMBER_EXPERIENCE_LEVELS = {
  Junior: 0,
  Intermediate: 1,
  Senior: 2,
  Expert: 3
}

export const getMemberPayRate = (level) => {
  switch (level) {
  case MEMBER_EXPERIENCE_LEVELS.Junior:
    return 8
  case MEMBER_EXPERIENCE_LEVELS.Intermediate:
    return 12
  case MEMBER_EXPERIENCE_LEVELS.Senior:
    return 18
  case MEMBER_EXPERIENCE_LEVELS.Expert:
    return 24
  default:
    return 0
  }
}