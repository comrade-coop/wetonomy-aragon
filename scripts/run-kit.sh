#!/bin/bash

set -e

aragon run --network rpc 2> /dev/null 1> /dev/null &
sleep 5
truffle migrate --network rpc

#when deploying to rinkeby checkout the adresses of daoFactory and ENS contracts in the migrations file
truffle exec ./scripts/create-dao.js $1 $2 --network rpc
      



tail -f /dev/null