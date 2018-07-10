# Wetonomy
An opinionated DAO framework on top of AragonOS

## Apps
This repository contains the following apps:
- **Members**: Manages the members in an organization

## Prerequisites

- [**Aragon**](https://aragon.one/): Aragon Dapp to create and manage decentralized organizations on Ethereum.
- [**Lerna**](https://lernajs.io/): A tool for managing JavaScript projects with multiple packages.  
- [**Solhint**](https://www.npmjs.com/package/solhint): Open source project for linting Solidity code.
- [**Truffle**](https://github.com/trufflesuite/truffle): Used to build and test the contracts 

## Developing

## Kit Usage
These are the steps required to build and run the Wetonomy Kit as a whole.

First, install the separate package dependencies through Lerna:
```sh
npm run bootstrap
```

Then start a local Devchain with:
```sh
npm run devchain
```

Then in a separate Terminal run the following in order to build the separate apps and run them as a Kit:
```sh
npm run start:kit
```

## Run tests
```sh
truffle develop
test
```

### NPM Scripts

- **bootstrap**: Use lerna to bootstrap the apps into packages
- **build**: Compiles the contracts and builds the front-end
- **build:apps**: Build only the apps
- **compile**: Use Solhint to lint the smart contracts
- **lint**: Run lint on contracts
- **publish**: Builds the apps and the contracts and publishes them to IPFS and APM
- **publish:apps**: Publishes the separate apps  
- **start:kit**: Run the whole Kit locally
- **test**: Runs tests for the contracts
- **devchain**: Starts a local Ganache-CLI devchain


### Libraries
- [**@aragon/os**](https://github.com/aragon/aragonos): Aragon interfaces
- [**@aragon/client**](https://github.com/aragon/aragon.js/tree/master/packages/aragon-client): Wrapper for Aragon application RPC
- [**@aragon/ui**](https://github.com/aragon/aragon-ui): Aragon UI components (in React)