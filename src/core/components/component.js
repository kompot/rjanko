import React from 'react';
import classnames from 'classnames';
import queryString from 'query-string';
import debug from 'debug';

import {Reference} from '../Structure';
import immutableShallowEqual from '../immutableShallowEqual';
import routes from '../routes'


export function shouldComponentUpdate(nextProps, nextState) {
  return !immutableShallowEqual(this.props, nextProps) ||
         !immutableShallowEqual(this.state, nextState);
}


export class Component extends React.Component {

  getDataPath() {
    return [];
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate.call(this, nextProps, nextState);
  }

  renderLoading() {
    return <Indicator />;
  }

  renderLoaded() {
    throw new Error('renderLoaded not implemented');
  }

  isLoaded({data}) {
    if (data instanceof Reference) {
      const dataCursor = data.cursor(this.getDataPath());
      if (typeof dataCursor.deref() === 'undefined') {
        return false;
      }
    }
    return true;
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

export {classnames, makePath, getRoute, navigateTo};
