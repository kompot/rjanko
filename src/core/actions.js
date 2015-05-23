export default class Actions {

  constructor(tree) {
    this.tree = tree;
  }

  actions = {

    admin: {
      login(payload) {
        console.log('login action payload is', payload);
      }
    }

  }

}
