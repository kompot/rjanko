import React from 'react';
import axios from 'axios';

import {Component} from '../components/component';

export default class Login extends Component {

  login = () => {
    const d = this.props.form.deref().toJS();
    axios.post('/api/login', d);
  };

  usernameChanged = (e) => {
    this.props.form.cursor('username').set(e.target.value);
  };

  passwordChanged = (e) => {
    this.props.form.cursor('password').set(e.target.value);
  };

  renderLoaded({form}) {
    return (
      <div>
        <h1>Login</h1>
        <dl>
          <dt>username</dt>
          <dd><input name='username' value={form.get('username')}
                     onChange={this.usernameChanged} /></dd>
          <dt>password</dt>
          <dd><input name='password' value={form.get('password')}
                     onChange={this.passwordChanged} /></dd>
        </dl>
        <button onClick={this.login}>login</button>
      </div>
    )
  }

}
