import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import queryString from 'query-string';
import debug from 'debug';
import {branch} from 'baobab-react/decorators';
import PropTypes from 'baobab-react/prop-types';

import routes from '../routes';
import Actions from '../actions';


export class Component extends React.Component {

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
    return 'loading!';
  }

  renderLoaded() {
    return <div>renderLoaded not implemented</div>;
  }

  isLoaded({data}) {
    //if (data instanceof Reference) {
    //  const dataCursor = data.cursor(this.getDataPath());
    //  if (typeof dataCursor.deref() === 'undefined') {
    //    return false;
    //  }
    //}
    return true;
  }

  render() {
    //if (!this.isLoaded(this.props, this.state)) {
    //  return this.renderLoading();
    //}
    console.log('render component', this.constructor.name);
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

export {classnames, makePath, getRoute, navigateTo};
