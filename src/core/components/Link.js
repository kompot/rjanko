import React from 'react';

import {Component, makePath, classnames} from '../components/Component';
import routes from '../routes';

export default class Link extends React.Component {

  constructor(props) {
    super(props);
  }

  _getUrl() {
    return this.props.href || makePath(this.props.name, this.props.params || {}, this.props.query || {});
  }

  clickHandler = (e) => {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    routes.navigateTo(this._getUrl());
  }

  render() {
    return (
      <a {...this.props} onClick={this.clickHandler} href={this._getUrl()}
                         className={classnames('Link', this.props.className)} />
    );
  }

}
