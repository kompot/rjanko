import React from 'react';

import DataDisplay from './DataDisplay';
import Login from '../admin/Login';
import UserInfo from '../admin/UserInfo';

const pages = {

  home(data, params, query) {
    return <div data={data} params={params} query={query}>h o m e</div>;
  },

  admin(data, params, query) {
    return <div data={data} params={params} query={query}>
      <Login form={data.select(['admin', 'loginForm'])} />
    </div>;
  },

  404(data, params, query) {
    return <div data={data} params={params} query={query}>4 0 4</div>;
  },

  500(data, params, query) {
    return <div data={data} params={params} query={query}>5 0 0</div>;
  }

};

export default class Layout extends React.Component {

  render() {
    return (
      <div className='Layout'>
        layout
        <UserInfo />
        <Login />
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
