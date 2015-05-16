import React from 'react';
import {Component, makePath, classnames} from './component';
import routes from '../routes';

export default class Link extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCurrent: false,
      selectedParent: false
    }
  }
  
  _getUrl() {
    return this.props.href || makePath(this.props.name, this.props.params || {}, this.props.query || {});
  }

  _updateSelected() {
    let selectedCurrent = document.location.pathname === this._getUrl();
    if (!selectedCurrent) {
      const pq = document.location.pathname + document.location.search;
      var selectedParent = pq.startsWith(this._getUrl());
    }
    this.setState({selectedCurrent, selectedParent});
  }

  componentDidMount() {
    this._updateSelected();
  }

  componentDidUpdate() {
    this._updateSelected();
  }

  clickHandler = (e) => {
    e.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(e);
    }
    routes.navigateTo(this._getUrl());
  }

  renderLoaded() {
    return (
      <a {...this.props} onClick={this.clickHandler} href={this._getUrl()} className={classnames('Link', this.props.className, {
        'Link--SelectedCurrent': this.state.selectedCurrent,
        'Link--SelectedParent': this.state.selectedParent
      })} />
    );
  }

};
