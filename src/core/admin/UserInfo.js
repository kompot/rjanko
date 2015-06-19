import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from '../components/Component';
import Link from '../components/Link';

@branch({
  cursors: {
    user: ['user']
  }
})
export default class UserInfo extends Component {

  renderLoaded({user}) {
    return (
      <div>
        {user
            ? user.username
            : <span><Link name='adminLogin'>login</Link></span>
        }
      </div>
    );
  }

}
