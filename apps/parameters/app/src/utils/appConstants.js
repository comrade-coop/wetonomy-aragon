import abi from 'web3-eth-abi'

export const APP_NAME = 'Wetonomy Parameters Board'
export const DIFFICULTIES = ['Low','Medium','High','Expert']
export const WORK_FIELD = ['Development','Marketing','Design','Organizing']
export const COLUMNS = ['Unassigned','Assigned','In Progress','Review','Done']
export const PanelMode = {
  MEMBERS_REPUTATUIN: 'Change Initial Member Reputation',
  TIMETRACKING_PERIOD: 'Change Period Lenght',
  TIMETRACKING_MAX_HOURS: 'Change Max Hours per Month',
  TOKEN_MULTIPLAYER: 'Change Default Inflation Multiplayer',
  REWARD_TO_DAO_COURSE: 'Change Reward To Dao Course',
  BASE: 'BASE'
  
}
export const TokenType = {
  REWARD: 'Reward',
  DAO: 'Dao'
}
export const _getAddress = (type, parameters) => {
  switch(type) {
    case PanelMode.MEMBERS_REPUTATUIN: {return parameters.membersAddress}
    case PanelMode.TIMETRACKING_PERIOD: {return parameters.timeTrackingAddress}
    case PanelMode.TIMETRACKING_MAX_HOURS: {return parameters.timeTrackingAddress}
    case PanelMode.TOKEN_MULTIPLAYER: {return parameters.tokenManagerAddress}
    case PanelMode.REWARD_TO_DAO_COURSE: {return parameters.tokenManagerAddress}
    default: return ''
  }
}

export const functionsStructurs = (type, parameter) => {
  console.log(parameter)
  switch(type) {
    case PanelMode.MEMBERS_REPUTATUIN: {
      return abi.encodeFunctionCall({
        name: 'setInitialReputation',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_initialReputation'
        }]
      }, [parameter])
    }
    case PanelMode.TIMETRACKING_PERIOD: {
      parameter = parameter*60 * 60 * 24
      return abi.encodeFunctionCall({
        name: 'changePeriodLength',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_periodLength'
        }]
      }, [parameter])
    }
    case PanelMode.TIMETRACKING_MAX_HOURS: {
      return abi.encodeFunctionCall({
        name: 'changeMaxHoursPerPeriod',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_maxHoursPerPeriod'
        }]
      }, [parameter])
    }
    case PanelMode.TOKEN_MULTIPLAYER: {
      return abi.encodeFunctionCall({
        name: 'changeInflationMultiplier',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_inflationMultiplier'
        }]
      }, [parameter])
    }
    case PanelMode.REWARD_TO_DAO_COURSE: {
      return abi.encodeFunctionCall({
        name: 'changeRewardToDaoCourse',
        type: 'function',
        inputs: [{
          type: 'uint256',
          name: '_rewardToDaoCourse'
        }]
      }, [parameter])
    }
    default: return ''
  }
}