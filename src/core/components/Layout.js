import React from 'react';
import Immutable from 'immutable';

import component from './component';
import DataDisplay from './DataDisplay';
import Link from './Link';

const pages = {

  home(data, params, query) {
    return <div data={data} params={params} query={query}>h o m e</div>;
  },

  admin(data, params, query) {
    return <div data={data} params={params} query={query}>a d m i n</div>;
  },

  404(data, params, query) {
    return <div data={data} params={params} query={query}>4 0 4</div>;
  },

  500(data, params, query) {
    return <div data={data} params={params} query={query}>5 0 0</div>;
  }

};


export default component('Layout', function({data}) {
  const pageName = data.cursor(['route', 'name']).deref();
  const params = data.cursor(['route', 'params']).deref().toJS();
  const query = data.cursor(['route', 'query']).deref().toJS();
  return (
    <div className='Layout'>
      <h1>{data.cursor(['header', 'title']).deref()}</h1>
      <h2>
        <Link name='home'>home</Link> | <Link name='admin'>admin</Link> | <Link href='/non-existing-link'>non existing</Link>
      </h2>
      {pages[pageName](data, params, query)}
      <footer>footer</footer>
      <DataDisplay data={data} />
    </div>
  );
});
