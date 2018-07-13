var TimeTracking = artifacts.require('./TimeTracking.sol')

module.exports = function (deployer) {
  deployer.deploy(TimeTracking)
}
