import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from '../components/Component';

@branch({
  cursors: {
    user: ['user']
  }
})
export default class UserInfo extends Component {

  renderLoaded({user}) {
    return (
      <div>
        {this.props.user && this.props.user.username}
        {!this.props.user && 'click login to log in'}
      </div>
    );
  }

}
