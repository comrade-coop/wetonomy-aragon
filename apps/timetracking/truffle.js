module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*'
    },
    compilers: {
     solc: {
       version: "0.4.18"  // ex:  "0.4.20". (Default: Truffle's installed solc)
     }
    }
  }
}
