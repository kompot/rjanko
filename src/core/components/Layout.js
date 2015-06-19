import React from 'react';

import DataDisplay from '../components/DataDisplay';
import UserInfo from '../admin/UserInfo';
import Link from '../components/Link';
import {PageRouter} from '../pages';

import models from '../../models';

export default class Layout extends React.Component {

  render() {
    return (
      <div className='Layout'>
        <UserInfo />
        <hr />
        <h3>Rjanko models</h3>

        {Object.keys(models).map(m =>
          <Link name={`admin${m}List`} className='Layout-NavLink'>{m}</Link>
        )}

        {require('cfg').applications.map(app => {
          return <div>
            <h3>{app.name} models</h3>
            {Object.keys(app.models).map(m =>
              <Link name={`admin${m}List`}>{m}</Link>
            )}
          </div>
        })}

        <hr />

        <PageRouter />
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
