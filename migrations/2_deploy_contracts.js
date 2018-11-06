const deployDAOFactory = require('@aragon/os/scripts/deploy-daofactory')

const WetonomyKit = artifacts.require('./WetonomyKit.sol')
const ensContract = process.env.ENS || '0x5f6f7e8cc7346a11ca2def8f827b7a0b612c56a1'

module.exports = deployer => {
  deployer.then(async () => {
    const { daoFactory } = await deployDAOFactory(null, {
      artifacts,
      verbose: false
    })
  
    await deployer.deploy(WetonomyKit, daoFactory.address, ensContract, 0)
  })
}
