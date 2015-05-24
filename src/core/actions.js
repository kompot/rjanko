// should put path here automagically, via webpack loader probably
const dbg = require('./logging/debug')('src/core/actions');

export default class Actions {

  constructor(tree) {
    this.tree = tree;
  }

  actions = {

    admin: {
      login(payload) {
        dbg('login action payload is', payload);
      }
    }

  }

}
