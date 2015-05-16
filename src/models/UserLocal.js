import User from './User';

export default class UserLocal extends User {

  constructor(id, email, password) {
    super(id);
    this.email = email;
    this.password = password;
  }

}
