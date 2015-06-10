import React from 'react';

import DataDisplay from '../components/DataDisplay';
import UserInfo from '../admin/UserInfo';
import Link from '../components/Link';
import {PageRouter} from '../pages';
import models from '../../models/viewable';

import subprojectModels from 'subproject/src/models';

export default class Layout extends React.Component {

  render() {
    return (
      <div className='Layout'>

        <h3>Rjanko models</h3>

        {models.map((m) =>
          <Link name={`admin${m}List`}>{m}</Link>
        )}

        <h3>Project models</h3>

        {Object.keys(subprojectModels).map(m =>
          <Link name={`admin${m}List`}>{m}</Link>
        )}

        <hr />

        <UserInfo />
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
