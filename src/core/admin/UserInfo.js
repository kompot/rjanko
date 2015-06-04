import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from 'core/components/Component';

@branch({
  cursors: {
    user: ['user']
  }
})
export default class UserInfo extends Component {

  renderLoaded({user}) {
    return (
      <div>
        {user && user.username}
        {!user && 'click login to log in'}
      </div>
    );
  }

}
