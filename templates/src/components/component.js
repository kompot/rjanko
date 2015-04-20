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


export default function component(displayName, desc, noDataStub) {
  if (typeof desc === 'function') {
    const render = desc;
    desc = {
      render() {
        const {data} = this.props;
        if ((data instanceof Reference) && (typeof data.deref() === 'undefined')) {
          if (noDataStub) {
            return noDataStub(this.props, this.state);
          } else {
            return (
              <div className={classnames(displayName, `${displayName}--loading`)}>
                loading
              </div>
            );
          }
        }
        return render(this.props, this.state);
      }
    };
  }
  desc.displayName = displayName;
  desc.shouldComponentUpdate = shouldComponentUpdate;
  return React.createClass(desc);
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
