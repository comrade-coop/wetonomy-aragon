# wetonomy
Opinionated DAO framework on top of aragonOS

## Usage
```sh
npm run devchain # Starts a local devchain

lerna bootstrap # Bootstraps dependencies of the seperate projects inside apps/

npm run build:apps # Builds the Front-end of the apps
npm run publish:apps # Publishes the seperate apps to the devchain and IPFS
npm run start:kit # Finally, creates a new DAO, given the kit file in contracts/
```