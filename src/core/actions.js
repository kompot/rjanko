const debug = require('./logging/debug')(__filename);

export default class Actions {

  constructor(tree) {
    this.tree = tree;
  }

  actions = {

    admin: {
      login(payload) {
        debug('login action payload is', payload);
      }
    }

  }

}
