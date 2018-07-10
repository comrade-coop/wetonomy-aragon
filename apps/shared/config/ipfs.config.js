// IPFS daemon's default settings
export function defaultIPFSSettings(ipfsDataDir) {
  return {
    IPFSDataDir: ipfsDataDir,
    Addresses: {
     
    },
    
    SignalServer: 'star-signal.cloud.ipfs.team', // IPFS dev server
    Discovery: {
      MDNS: {
        Enabled: false,
        Interval: 10
      },
      webRTCStar: {
        Enabled: true
      }
    },    
  }
}
