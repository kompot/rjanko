import React from 'react';
import _ from 'lodash';
import {branch} from 'baobab-react/decorators';

import {Component, navigateTo, makePath} from '../components/Component';
import Link from '../components/Link';

import rjankoModels from '../../models';
let models = _.merge({}, rjankoModels);
require('cfg').applications.forEach(app => {
  Object.keys(app.models).forEach(m => models[m] = app.models[m]);
})

@branch({
  cursors: {
    list: ['admin', 'list']
  }
})
export default class ListPage extends Component {

  goToDetails = (id) => navigateTo(makePath(`admin${this.props.entity}Details`, {id}))

  renderLoaded({entity, list}) {
    if (!list || !list[entity]) {
      return <div>loading!</div>;
    }
    return (
      <div>
        <div className='ListPage-HeaderButtons'>
          <div>{entity}</div>
          <div>
            <Link name={`admin${entity}DetailsNew`}>
              <button>create new {entity}</button>
            </Link>
          </div>
        </div>
        <table className='ListPage-DataTable'>
          <thead>
            <tr>
              {Object.keys(models[entity].fields).map((field, j) =>
                <th key={j}>
                  {field}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {list[entity].map((item, i) =>
              <tr key={i} onClick={this.goToDetails.bind(this, item._id)}>
                {Object.keys(models[entity].fields).map((field, j) =>
                  <td key={j}>
                    {JSON.stringify(item[field])}
                  </td>
                )}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }

}
