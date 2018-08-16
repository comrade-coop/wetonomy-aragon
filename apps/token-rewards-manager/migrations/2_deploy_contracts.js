const TokenRewardsManager = artifacts.require('TokenRewardsManager.sol')

module.exports = (deployer) => {
    deployer.deploy(TokenRewardsManager)
}
