import React from 'react';

import DataDisplay from '../components/DataDisplay';
import UserInfo from '../admin/UserInfo';
import Link from '../components/Link';
import {PageRouter} from '../pages';

export default class Layout extends React.Component {

  render() {
    return (
      <div className='Layout'>

        <Link name='adminUserList'>user</Link>
        |
        <Link name='adminGroupList'>group</Link>

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
