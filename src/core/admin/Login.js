import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from '../components/Component';

@branch({
  cursors: {
    username: ['admin', 'loginForm', 'username'],
    password: ['admin', 'loginForm', 'password']
  }
})
export default class Login extends Component {

  login = () => {
    const {username, password} = this.props;
    // axios.post('/api/login', d);
    this.actions.admin.login({username, password});
  };

  usernameChanged = (e) => {
    this.cursors.username.set(e.target.value);
  };

  passwordChanged = (e) => {
    this.cursors.password.set(e.target.value);
  };

  renderLoaded({username, password}) {
    return (
      <div>
        <h1>Login</h1>
        <dl>
          <dt>username</dt>
          <dd><input name='username' value={username}
                     onChange={this.usernameChanged} /></dd>
          <dt>password</dt>
          <dd><input name='password' value={password}
                     onChange={this.passwordChanged} /></dd>
        </dl>
        <button onClick={this.login}>login</button>
      </div>
    );
  }

}
