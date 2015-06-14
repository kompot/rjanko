import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from './components/Component';
import Login from './admin/Login';
import ListPage from './pages/ListPage';
import DetailsPage from './pages/DetailsPage';

const pages = {

  adminLogin: () => <LoginPage />,
  error404: () => <Error404 />,
  error500: () => <Error500 />

};

function addViewForModel(model) {
  pages[`admin${model}List`] = () => <ListPage entity={model} />;
  pages[`admin${model}Details`] = () => <DetailsPage entity={model} />;
  pages[`admin${model}DetailsNew`] = () => <DetailsPage entity={model} isNew />;
}

Object.keys(require('../models')).map(addViewForModel);
require('cfg').applications.forEach(app =>
  Object.keys(app.models).forEach(addViewForModel)
);

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

export {PageRouter, LoginPage, Error404, Error500};
