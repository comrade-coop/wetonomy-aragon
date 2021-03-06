#!/bin/bash
 
set -e
 
aragon devchain 2> /dev/null 1> /dev/null &
sleep 5 # to make sure ganache-cli is up and running before compiling
rm -rf build
truffle test --network rpc
kill -9 $(lsof -t -i:8545)