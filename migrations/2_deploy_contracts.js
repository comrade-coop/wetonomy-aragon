const deployDAOFactory = require('@aragon/os/scripts/deploy-daofactory')

const WetonomyKit = artifacts.require('./WetonomyKit.sol')
const WetonomyKitAnyEntity = artifacts.require('./WetonomyKitAnyEntity.sol')
const ensContract = process.env.ENS ||  '0x5f6f7e8cc7346a11ca2def8f827b7a0b612c56a1' // rinkeby '0x98df287b6c145399aaa709692c8d308357bc085d'

module.exports = deployer => {
  deployer.then(async () => {
    const { daoFactory } = await deployDAOFactory(null, {
      artifacts,
      verbose: false
    })
    //rinkeby
    // const daoFactory = '0x2298d27a9b847c681d2b2c2828ab9d79013f5f1d'
  
    await deployer.deploy(WetonomyKitAnyEntity, daoFactory.address, ensContract, 0)
    await deployer.deploy(WetonomyKit, daoFactory.address, ensContract, 0)
  })
  
}
