const Parameters = artifacts.require('./Parameters.sol')

module.exports = async (deployer) => {  
  await deployer.deploy(Parameters)
}
