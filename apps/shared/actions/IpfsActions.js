'use strict';

import Reflux from 'reflux';

var IPFSDaemonActions = Reflux.createActions([
  "init",
  "start",
  "stop",
  "daemonStarted"
]);

export default IPFSDaemonActions;
