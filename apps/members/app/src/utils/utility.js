export const range = (size, startAt = 0) => {
  if (size === 0) {
    return []
  }
  
  return [...Array(size).keys()].map(i => i + startAt)
}