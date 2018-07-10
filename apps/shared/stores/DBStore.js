'use strict'

import Orbit from 'orbit_'
import Reflux from 'reflux'
import IPFSStore from 'stores/IPFSStore'
import AppActions from 'actions/AppActions'
import DBActions from 'actions/DBActions'
import IPFSActions from 'actions/IPFSActions'
import path from 'path'

const DBStore = Reflux.createStore({
  listenables: [IPFSActions, DBActions],

  // IPFS actions
  init: function () {
    this.orbit = null
    this.trigger(this.orbit)
  },

  onDisconnect: function () {
    this.orbit.disconnect()
  },

  onDaemonStarted: function (ipfs) {
    const options = {
      // path where to keep generates keys
      keystorePath: path.join(IPFSStore.getIPFSSettings().OrbitDataDir, "/data/keys"),
      // path to orbit-db cache file
      cachePath: path.join(IPFSStore.getIPFSSettings().OrbitDataDir, "/data/orbit-db"),
    }

    this.orbit = new Orbit(ipfs, options)

    this.orbit.events.on('connected', (network, user) => {

    })

    this.orbit.events.on('disconnected', () => {

    })

    AppActions.initialize(this.orbit)
    this.trigger(this.orbit)
  },

  // DB Actions
  onCreateDB: function (db) {
    await resetDatabase(db)

    try {
      const name = dbnameField.value

      // type = feed or log

      db = await orbitdb.open(name, {
        // If database doesn't exist, create it
        create: true,
        overwrite: true,
        // Load only the local version of the database, 
        // don't load the latest from the network yet
        localOnly: false,
        type: type,
        // If "Public" flag is set, allow anyone to write to the database,
        // otherwise only the creator of the database can write
        write: publicAccess ? ['*'] : [],
      })

      await load(db, 'Creating database...')
     // startWriter(db, interval)
    } catch (e) {
      console.error(e)
    }
  },

  onLoadDB: function (db) {
    // When the database is ready (ie. loaded), display results
    db.events.on('ready', () => queryAndRender(db))
    // When database gets replicated with a peer, display results
    db.events.on('replicated', () => queryAndRender(db))
    // When we update the database, display result
    db.events.on('write', () => queryAndRender(db))

    db.events.on('ready', () => {
      // TODO
    })

    // Load locally persisted database
    await db.load()
  },

  onOpenDB: function (db) {
    const address = dbAddressField.value

    await resetDatabase(db)

    try {
      db = await orbitdb.open(address, { sync: true })
      await load(db, 'Loading database...')

    } catch (e) {
      console.error(e)
    }
  },

  onQueryDB: function (db) {
    if (db.type === 'eventlog')
      return db.iterator({ limit: 5 }).collect()
    else if (db.type === 'feed')
      return db.iterator({ limit: 5 }).collect()
    else
      throw new Error("Unknown datatbase type: ", db.type)
  },

  onResetDB: function () {
    if (db) {
      await db.close()
    }
  }
})

export default DBStore
