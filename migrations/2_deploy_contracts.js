var App = artifacts.require('./CounterApp.sol')

module.exports = function (deployer) {
  deployer.deploy(App)
}
