# Wetonomy
An opinionated DAO framework on top of aragonOS

## Apps
This repository contains the following apps:
- Members - Manages the members in an organization

## Prerequisites

- [**aragon**](https://aragon.one/): Aragon dapp to create and manage decentralized organizations on Ethereum.
- [**lerna**](https://lernajs.io/): A tool for managing JavaScript projects with multiple packages.  
- [**solhint**](https://www.npmjs.com/package/solhint): Open source project for linting Solidity code.
- [**truffle**](https://github.com/trufflesuite/truffle): Used to build and test the contracts 

## Developing

## Kit Usage
These are the steps required to build and run the Wetonomy Kit as a whole.

First install the seperate package dependencies through Lerna:
```sh
npm run bootstrap
```

The start a local Devchain with:
```sh
npm run devchain
```

Then in a seperate Terminal run the following in order to build the seperate apps and run them as a Kit:
```sh
npm run start:kit
```

## Run tests
```sh
trufle develop
test
```

### NPM Scripts

- **bootstrap**: Use lerna to bootstrap the apps into packages
- **build**: Compiles the contracts and builds the front-end
- **build:apps**: Build only the apps
- **compile**: Use solhint to lint the smart contracts
- **lint**: Run lint on contracts
- **publish**: Builds the apps and the contracts and publishes them to IPFS and APM
- **publish:apps**: Publishes the seperate apps  
- **start:kit**: Run the whole Kit locally
- **test**: Runs tests for the contracts
- **devchain**: Starts a local Ganache-CLI devchain


### Libraries
- [**@aragon/os**](https://github.com/aragon/aragonos): Aragon interfaces
- [**@aragon/client**](https://github.com/aragon/aragon.js/tree/master/packages/aragon-client): Wrapper for Aragon application RPC
- [**@aragon/ui**](https://github.com/aragon/aragon-ui): Aragon UI components (in React)