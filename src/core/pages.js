import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from 'core/components/Component';
import Login from 'core/admin/Login';
import ListPage from 'core/pages/ListPage';
import DetailsPage from 'core/pages/DetailsPage';

const pages = {

  adminLogin: () => <LoginPage />,
  adminUsers: () => <UsersPage />,
  error404: () => <Error404 />,
  error500: () => <Error500 />

};

require('models/viewable').map((model) => {
  pages[`admin${model}List`] = () => <ListPage entity={model} />;
  pages[`admin${model}Details`] = () => <DetailsPage entity={model} />;
});


@branch({
  cursors: {
    route: ['route']
  }
})
class PageRouter extends Component {
  renderLoaded({route}) {
    return pages[route.name] && pages[route.name]() || <div>route not found, nothing to rende</div>;
  }
}

class LoginPage extends Component {

  renderLoaded() {
    return (
      <div>
        <Login />
        login page
      </div>
    );
  }

}

class UsersPage extends Component {

  renderLoaded() {
    return (
      <div>users page</div>
    );
  }

}

class Error404 extends Component {

  renderLoaded() {
    return (
      <div>error 404</div>
    );
  }

}

class Error500 extends Component {

  renderLoaded() {
    return (
      <div>error 500</div>
    );
  }

}

export {PageRouter, LoginPage, UsersPage, Error404, Error500};
