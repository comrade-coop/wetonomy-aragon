// IPFS daemon's default settings
export function defaultIPFSSettings(ipfsDataDir) {
  return {
    IPFSDataDir: ipfsDataDir,
    Addresses: {
      Swarm: [
        // Use IPFS dev signal server
        '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
      ]
    },
   
    //SignalServer: 'star-signal.cloud.ipfs.team', // IPFS dev server
    Discovery: {
      MDNS: {
        Enabled: false,
        Interval: 10
      },
      webRTCStar: {
        Enabled: true
      }
    },
    EXPERIMENTAL: {
      pubsub: true
    }
  }
}