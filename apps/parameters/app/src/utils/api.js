import Aragon, { providers } from '@aragon/client'
import { encodeCallScript } from '@aragon/test-helpers/evmScript'
import { functionsStructurs, _getAddress } from './appConstants'
import store from '../store'
import _ from 'lodash'
let app = null
let currentBlock = 0
export const initializeApp = (window, subscription) => {
  app = new Aragon(new providers.WindowMessage(window))
  app.state()
    .map(state => ({ ...state }))
    .subscribe(subscription)
  app.web3Eth('getBlockNumber').subscribe(blockNum => {currentBlock = blockNum})
}

export const callReadMethod = (method, ...args) => {
  return new Promise((resolve, reject) => {
    try {
      app
        .call(method, ...args)
        .first()
        .subscribe(result => {
          resolve(result)
        })
    } catch (error) {
      reject(error)
    }
  })
}

export const loadDaoTokenHistory = async() =>{
  const startBlock = await callReadMethod('getDaoCreationBlockNumber')
  const blockTokens = await Promise.all(_.range(startBlock, currentBlock+1).map(async index => {
    let tokens = await callReadMethod('getDaoTokensAtBlock', index)
    return {
      block: index,
      tokens: parseInt(tokens)
    }
  }))
  return blockTokens
}
export const loadRewardTokenHistory = async() =>{
  const startBlock = await callReadMethod('getRewardCreationBlockNumber')
  const blockTokens = await Promise.all(_.range(startBlock, currentBlock+1).map(async index => {
    let tokens = await callReadMethod('getRewardTokensAtBlock', index)
    return {
      block: index,
      tokens: parseInt(tokens)
    }
  }))
  return blockTokens
}

export const loadUserTokens = async() =>{
  const user = await loadCurrentAccount()
  const tokens = await callReadMethod('getUserBalance', user)
  return {reward: parseInt(tokens[0]), dao: parseInt(tokens[1])}
}

export const parameterChange = (type, parameter) => {
  const data = functionsStructurs(type, parameter)
  const action = { to: _getAddress(type, store.getState().parameters), calldata: data }
  const script = encodeCallScript([action])
  console.log(script)
  app.changeParameter(script, type + ': ' +parameter)
}

const loadCurrentAccount = async() => {
  return new Promise((resolve, reject) => {
    try {
      app.accounts().subscribe(accounts => {
        const currentAccount = accounts[0]
        if (currentAccount) {
          resolve(currentAccount)
        } else {
          reject('A valid account address wasn\'t found')
        }

      })
    } catch (error) {
      reject(error)
    }    
  })
}