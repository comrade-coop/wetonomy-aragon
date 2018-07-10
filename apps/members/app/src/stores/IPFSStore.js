import IPFS from 'ipfs'
import IPFSActions from '../actions/IPFSActions'
import path from 'path'
import Reflux from 'reflux'
import isArray from 'lodash.isarray'
import mergeWith from 'lodash.mergewith'

import {defaultIPFSSettings} from '../config/ipfs.config'
import {defaultOrbitSettings} from '../config/orbit.config'

var IPFSStore = Reflux.createStore({
  listenables: [IPFSActions],
  init: function () {
    this.ipfs = null
    this.ipfsSettings = {}
    this.settings = {}

    let orbitDataDir = '/orbit'
    let ipfsDataDir = '/orbit/ipfs'
    let settings = [defaultIPFSSettings(ipfsDataDir), defaultOrbitSettings(orbitDataDir)]

    settings.forEach(item => {
      mergeWith(this.ipfsSettings, item, (sourceValue) => {
        return isArray(sourceValue) ? sourceValue : undefined
      })
    })

    this.trigger(this.ipfsSettings)
  },

  onStart: function () {
    let settings = Object.assign({}, this.ipfsSettings)
    settings.OrbitDataDir = path.join(settings.OrbitDataDir, '/')
    this.settings = Object.assign({}, settings)

    this.ipfs = new IPFS(this.settings)
    
    this.ipfs.on('ready', () => {
      IPFSActions.daemonStarted(this.ipfs)
    })
    this.ipfs.on('error', (e) => console.log(e))
  },

  onStop: function () {
  },

  getIPFSSettings: function () {
    return this.settings
  }
})

export default IPFSStore