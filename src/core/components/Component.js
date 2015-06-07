import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import queryString from 'query-string';
import PropTypes from 'baobab-react/prop-types';

import routes from 'core/routes';
import Actions from 'core/actions';

const debug = require('core/logging/debug')(__filename);

class Component extends React.Component {

  static contextTypes = {
    tree: PropTypes.baobab,
    cursors: PropTypes.cursors
  }

  componentWillMount() {
    this.tree = this.context.tree;
    this.cursors = this.context.cursors;
    this.actions = new Actions(this.tree).actions;
  }

  getDataPath() {
    return [];
  }

  renderLoading() {
    return <div>loading!</div>;
  }

  renderLoaded() {
    return <div>renderLoaded not implemented</div>;
  }

  isLoaded(props, state) {
    return !_.isEmpty(this.tree.select(this.getDataPath()).get());
  }

  render() {
    if (!this.isLoaded(this.props, this.state)) {
      return this.renderLoading();
    }
    return this.renderLoaded(this.props, this.state);
  }

}


function makePath(name, params, query = {}) {
  const qs = queryString.stringify(query);
  return routes.makePath(name, params) + (qs ? `?${qs}` : '');
}


function getRoute(path) {
  return routes.getRoute(path);
}


function navigateTo(url) {
  return routes.navigateTo(url);
}

export {Component, classnames, makePath, getRoute, navigateTo};
