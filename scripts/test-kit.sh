#!/bin/bash
 
set -e
 
aragon devchain 2> /dev/null 1> /dev/null &
sleep 5
npm run publish
truffle test --network rpc
kill -9 $(lsof -t -i:8545)