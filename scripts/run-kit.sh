#!/bin/bash

set -e

aragon run --network rpc 2> /dev/null 1> /dev/null &
sleep 5
truffle migrate --network rpc
truffle exec ./scripts/create-dao.js --network rpc

tail -f /dev/null