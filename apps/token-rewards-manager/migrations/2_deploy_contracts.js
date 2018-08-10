const ExchangeTokenManager = artifacts.require('ExchangeTokenManager.sol')

module.exports = (deployer) => {
    deployer.deploy(ExchangeTokenManager)
}
