const Members = artifacts.require('./Members.sol')

module.exports = async (deployer) => {  
  await deployer.deploy(Members)
}
