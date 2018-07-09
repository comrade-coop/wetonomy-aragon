# Wetonomy

## Apps
This repository contains the following apps:
- Members - Manages the members in an organization

## Prerequisites

- [**aragon**](https://aragon.one/): Aragon dapp to create and manage decentralized organizations on Ethereum.
- [**lerna**](https://lernajs.io/): A tool for managing JavaScript projects with multiple packages.  
- [**solhint**](https://www.npmjs.com/package/solhint): Open source project for linting Solidity code.
- [**truffle**](https://github.com/trufflesuite/truffle): Used to build and test the contracts 

## What's in the box?

### npm Scripts

- **bootstrap**: Use lerna to bootstrap the apps into packages
- **build**: Compiles the contracts and builds the front-end
- **build:apps**: Build only the apps
- **compile**: Use solhint to lint the smart contracts
- **lint**: Run lint on contracts
- **publish**: Builds the apps and the contracts and publishes them to IPFS and APM
- **publish:apps**: Publishes only the apps  
- **start**: Run the app locally
- **sycn-assets**: Sync the assets into dist folder
- **test**: Runs tests for the contracts

### Libraries

- [**@aragon/os**](https://github.com/aragon/aragonos): Aragon interfaces
- [**@aragon/client**](https://github.com/aragon/aragon.js/tree/master/packages/aragon-client): Wrapper for Aragon application RPC
- [**@aragon/ui**](https://github.com/aragon/aragon-ui): Aragon UI components (in React)


## Develop

### Run tests
- Run ```trufle develop```
- Run ```test```


### Run app
- Init IPFS if not already initialized:
 	- ```ipfs init```
- Start IPFS if not started
	- ```ipfs daemon```
- Run 
	- ```aragon run```

