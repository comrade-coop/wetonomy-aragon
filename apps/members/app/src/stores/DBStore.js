import Orbit from 'orbit-db'
import Reflux from 'reflux'
import IPFSStore from './IPFSStore'
import AppActions from '../actions/AppActions'
import DBActions from '../actions/DBActions'
import IPFSActions from '../actions/IPFSActions'
import path from 'path'

const DB_NAME = 'wetonomy-members'

const DBStore = Reflux.createStore({
  listenables: [IPFSActions, DBActions],

  init: function () {
    this.orbit = null
    this.feed = null
    this.trigger(this.orbit)
    this.trigger(this.feed)
  },

  onDisconnect: function () {
    this.orbit.disconnect()
  },

  onDaemonStarted: function (ipfs) {
    const options = {
      keystorePath: path.join(IPFSStore.getIPFSSettings().OrbitDataDir, '/data/keys'),
      cachePath: path.join(IPFSStore.getIPFSSettings().OrbitDataDir, '/data/orbit-db'),
    }

    this.orbit = new Orbit(ipfs, options.keystorePath, options)

    this.onCreate(this.orbit)

    AppActions.initialize(this.orbit)
    this.trigger(this.orbit)
  },

  // DB Actions
  onCreate: async function (orbit) {
    try {
      const config = {
        // If database doesn't exist, create it
        create: true,
        // Don't wait to load from the network
        sync: false,
        // Load only the local version of the database
        localOnly: true,
        // Allow anyone to write to the database,
        //// otherwise only the creator of the database can write
        admin: ['*'],
        write: ['*'],
      }

      this.feed = await orbit.feed(DB_NAME, config)

      this.onLoad(this.feed, 'Creating database...')
    } catch (e) {
      console.error(e)
    }
  },

  onLoad: async function (db) {
    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => {
      // TODO
      console.log('onLoad reaplicated')
    })
    // When we update the database, display result
    db.events.on('write', () => {
      // TODO
      console.log('onLoad write')
    })

    db.events.on('ready', () => {
      // TODO
      console.log('onLoad ready')
    })

    db.load()
  },

  onOpen: function (db) {
    const address = ''//dbAddressField.value

    this.onReset(db)

    try {
      db = db.open(address, { sync: true })
      this.onLoad(db, 'Loading database...')

    } catch (e) {
      console.error(e)
    }
  },

  onQuery: function (db) {
    db.iterator({ limit: 5 }).collect()
  },

  onReset: function (db) {
    if (db) {
      db.close()
    }
  }
})

export default DBStore