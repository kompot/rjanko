import Api from 'core/api';

const debug = require('core/logging/debug')(__filename);

export default class Actions {

  constructor(tree) {
    this.tree = tree;
  }

  actions = {

    admin: {
      login: async ({username, password}) => {
        debug(`login action payload is ${username} ${password}`);
        const loginResult = await Api.login({username, password});
        this.tree.set('user', loginResult.data);
      }
    }

  }

}
