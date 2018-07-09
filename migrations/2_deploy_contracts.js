var DummyApp = artifacts.require('./misc/DummyApp.sol')

module.exports = function (deployer) {
  deployer.deploy(DummyApp)
}
