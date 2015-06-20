import React from 'react';

import DataDisplay from '../components/DataDisplay';
import UserInfo from '../admin/UserInfo';
import ProjectInfo from '../admin/ProjectInfo';
import Link from '../components/Link';
import {PageRouter} from '../pages';

import models from '../../models';

export default class Layout extends React.Component {

  render() {
    return (
      <div className='Layout'>
        <div className='Layout-Header'>
          <ProjectInfo />
          <UserInfo />
        </div>
        <div className='Layout-Content'>
          <div className='Layout-Navigation'>
            {Object.keys(models).map(m =>
              <div>
                <Link name={`admin${m}List`} className='Layout-NavLink'>{m}</Link>
              </div>
            )}
            {require('cfg').applications.map(app =>
              <div className='Layout-NavigationGroup'>
                <h3>{app.name}</h3>
                {Object.keys(app.models).map(m =>
                  <div>
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
