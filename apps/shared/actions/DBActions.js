'use strict';

import Reflux from 'reflux';

var DBActions = Reflux.createActions([
  "createDB",
  "loadDB",
  "openDB",
  "resetDB",
  "queryDB"
]);

export default DBActions;