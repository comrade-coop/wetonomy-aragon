const organizationName = 'Comrade'
const members = [
  {
    name: 'John Smith',
    accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724E86',
    level: 'Senior',
    reputation: 324,
    payRate: 24
  }, {
    name: 'John Smith',
    accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724C86',
    level: 'Senior',
    reputation: 324,
    payRate: 24
  }, {
    name: 'John Smith',
    accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724D86',
    level: 'Senior',
    reputation: 324,
    payRate: 24
  }, {
    name: 'John Smith',
    accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724F86',
    level: 'Senior',
    reputation: 324,
    payRate: 24
  }, {
    name: 'John Smith',
    accountAddress: '0x969F8A3667987823B84C4F22A4CdfEA3Ae724G86',
    level: 'Senior',
    reputation: 324,
    payRate: 24
  }
]
const memberDebt = 1230.53
const rewardTokens = 320

export const getMembers = () => {
  return new Promise((resolve) => {
    resolve(members)
  })
}

export const getOrganizationName = () => {
  return new Promise((resolve) => {
    resolve(organizationName)
  })
}

export const getMemberDebt = () => {
  return new Promise((resolve) => {
    resolve(memberDebt)
  })
}

export const getRewardTokens = () => {
  return new Promise((resolve) => {
    resolve(rewardTokens)
  })
}
