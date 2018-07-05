var Members = artifacts.require('./Members.sol')

module.exports = function (deployer) {
  deployer.deploy(Members)
}
