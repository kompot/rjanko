import React from 'react';
import {branch} from 'baobab-react/decorators';

import {Component} from '../components/Component';
import DataDisplay from '../components/DataDisplay';
import UserInfo from '../admin/UserInfo';
import ProjectInfo from '../admin/ProjectInfo';
import Link from '../components/Link';
import {PageRouter} from '../pages';

import models from '../../models';

@branch({
  cursors: {
    activities: ['user', 'activities']
  }
})
export default class Layout extends Component {

  hasPermissionToRead = (m) => this.props.activities && this.props.activities.indexOf('read ' + m.toLowerCase()) !== -1

  renderLoaded({activities}) {
    return (
      <div className='Layout'>
        <div className='Layout-Header'>
          <ProjectInfo />
          <UserInfo />
        </div>
        <div className='Layout-Content'>
          <div className='Layout-Navigation'>
            {Object.keys(models)
              .filter(this.hasPermissionToRead)
              .map((m, i) =>
              <div key={i}>
                <Link name={`admin${m}List`} className='Layout-NavLink'>{m}</Link>
              </div>
            )}
            {require('cfg').applications.map((app, i) =>
              <div className='Layout-NavigationGroup' key={i}>
                <h3>{app.name}</h3>
                {Object.keys(app.models)
                  .filter(this.hasPermissionToRead)
                  .map((m, j) =>
                  <div key={j}>
                    <Link name={`admin${m}List`}>{m}</Link>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className='Layout-Data'>
            <PageRouter />
          </div>
        </div>




        {/*
        <h1>{data.select(['header', 'title']).get()}</h1>
        <h2>
          <Link name='home'>home</Link> |
          <Link name='admin'>admin</Link> |
          <Link href='/non-existing-link'>non existing</Link>
        </h2>
        {pages[pageName](data, params, query)}
        <footer>footer</footer>

         */}
        <DataDisplay />
      </div>
    );
  }

}
