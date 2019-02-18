const { createDAOWithTokens, getAppsProxyAddress } = require('./util')
const opn = require('opn')

module.exports = async function(callback) {
  try {
    let WetonomyKit;
    if(process.argv[4] === "wetonomyKitAnyEntity"){
      WetonomyKit = artifacts.require('WetonomyKitAnyEntity.sol')
      console.log('Creating a Wetonomy DAO with no ACL...')
    }
    else {
      WetonomyKit = artifacts.require('WetonomyKit.sol')
      console.log('Creating a Wetonomy DAO...')
    }
    const kit = await WetonomyKit.deployed()
    const { dao, events, rewardToken, daoToken } = await createDAOWithTokens(kit)
    console.log('Kit Address: ',kit.address)
    const daoLocation = `http://localhost:3000/#/${dao}`
    console.log('Successfully created a Wetonomy DAO at address:', dao)
    if(process.argv[5] === "dummyData"){
      const Kernel = artifacts.require('Kernel.sol')
      const Members = artifacts.require('Members.sol')
      // const TaskBoard = artifacts.require('TaskBoard.sol')
      const InflationTimeTracking = artifacts.require('InflationTimeTracking.sol')

      const kernel = Kernel.at(dao)
      const address = await getAppsProxyAddress(kernel, kit, events)
      
      const membersApp = Members.at(address.members)
      const timeTrackingApp = InflationTimeTracking.at(address.timeTracking)
      await membersApp.addMember(
        '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
        'John Doe',
        2
      )
      await timeTrackingApp.trackAndClaim(4)
      await membersApp.addMember(
        '0x8401Eb5ff34cc943f096A32EF3d5113FEbE8D4Eb',
        'John Doe\'s Brother' ,
        2
      )
      await timeTrackingApp.trackAndClaim(4)
    }

    console.log('Reward Token Address:', rewardToken)
    console.log('DAO Token Address:', daoToken)

    console.log(`Opening browser to view your DAO at ${daoLocation}`)
    opn(daoLocation)
  } catch (err) {
    callback(err)
  }

  callback()
}
