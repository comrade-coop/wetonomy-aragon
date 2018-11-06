const { createDAOWithTokens } = require('./util')
const opn = require('opn')

module.exports = async function(callback) {
  try {
    const WetonomyKit = artifacts.require('WetonomyKit.sol')

    console.log('Creating a Wetonomy DAO...')

    const kit = await WetonomyKit.deployed()
    const { dao, rewardToken, daoToken } = await createDAOWithTokens(kit)

    const daoLocation = `http://localhost:3000/#/${dao}`

    console.log('Successfully created a Wetonomy DAO at address:', dao)
    console.log('Reward Token Address:', rewardToken)
    console.log('DAO Token Address:', daoToken)

    console.log(`Opening browser to view your DAO at ${daoLocation}`)
    opn(daoLocation)
  } catch (err) {
    callback(err)
  }

  callback()
}
