import React from 'react';
import Promise from 'bluebird';
import {branch} from 'baobab-react/decorators';

import {Component} from './components/Component';
import Login from './admin/Login';
import Api from './api.js';

const pages = {

  adminLogin: () => <LoginPage />,
  adminUsers: () => <UsersPage />,
  adminPersons: () => <PersonsPage />,
  error404: () => <Error404 />,
  error500: () => <Error500 />

};

require('../models/viewable').map((model) => {
  pages[`admin${model}List`] = () => <ListPage entity={model} />;
  pages[`admin${model}Details`] = () => <DetailsPage entity={model} />;
});

const yup = require('yup');
const Form = require('react-formal');

import models from '../models';

@branch({
  cursors: {
    list: ['admin', 'list']
  }
})
class ListPage extends Component {

  renderLoaded({entity, list}) {
    if (!list[entity]) {
      return <div>loading!</div>;
    }
    return (
      <div>
        ListPage {entity}
        <table>
          <tbody>
           <tr>
              <th></th>
              {Object.keys(models[entity].fields).map((field, j) => {
                return <td style={{borderBottom: '1px solid #bbb'}}>
                  {field}
                </td>;
              })}
            </tr>
            {list[entity].map((item, i) => {
              return <tr>
                <td>{i}</td>
                {Object.keys(models[entity].fields).map((field, j) => {
                  return <td style={{borderBottom: '1px solid #bbb'}}>
                    {JSON.stringify(item[field])}
                  </td>;
                })}
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    );
  }

}

class DetailsPage extends Component {

  renderLoaded({entity}) {
    return (
      <div>
        DetailsPage {entity}
      </div>
    );
  }

}

@branch({
  cursors: {
    route: ['route']
  }
})
class PageRouter extends Component {
  renderLoaded({route}) {
    return pages[route.name] && pages[route.name]() || <div>route not found, nothing to rende</div>;
  }
}

class LoginPage extends Component {

  renderLoaded() {
    return (
      <div>
        <Login />
        login page
      </div>
    );
  }

}

class UsersPage extends Component {

  renderLoaded() {
    return (
      <div>users page</div>
    );
  }

}



Form.addInputTypes(require('react-formal-inputs'));

class PersonsPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model: {},
      groups: []
    };
  }

  updateFormValue = (model) => {
    this.setState({model});
    console.log('_________model', model);
  };

  colorOnChange = (v) => {
    console.log('_______colorOnChange', v);
  };

  colorSearch = v => console.log('_______ colorSearch', v);

  groupSearch = async (v) => {
    console.log('_______ groupSearch before', v);
    const result = await Api.groups({search: v});
    this.setState({
      groups: result.data
    });
    console.log('_______ groupSearch after', result.data);
  };

  saveForm = () => {
    console.log('_________', this.state.model);
  };

  render() {
    return (
      <div>
        <Form
            schema={models.User}
            value={this.state.model}
            onChange={model => this.updateFormValue(model)}
            >
          <fieldset>
            <legend>Person</legend>

            <dl>
              <dt><Form.Field name='name.first' /></dt>
              <dd><Form.Message for='name.first' /></dd>
              <dt><Form.Field name='name.last' /></dt>
              <dd><Form.Message for='name.last' /></dd>
              <dt><Form.Field name='dateOfBirth' /></dt>
              <dd><Form.Message for='dateOfBirth' /></dd>
              <dt>
                <label>Favorite Color</label>
                <Form.Field name='colorIds' type='multiselect'
                            onSearch={this.colorSearch}
                            defaultValue={['orange', 'red']}
                            data={['orange', 'red', 'blue', 'purple']}
                            onChange={this.colorOnChange} />
              </dt>
              <dd>
                <Form.Message for='colorId'/>
              </dd>
              <dt>Groups</dt>
              <dd>
                <Form.Field name='groups' type='multiselect'
                            valueField='id' textField='name'
                            data={this.state.groups}
                            onSearch={this.groupSearch} />
              </dd>
            </dl>

          </fieldset>
          <Form.Button onClick={this.saveForm} type='submit'>Submit</Form.Button>
        </Form>
      </div>
    );
  }

}

class Error404 extends Component {

  renderLoaded() {
    return (
      <div>error 404</div>
    );
  }

}

class Error500 extends Component {

  renderLoaded() {
    return (
      <div>error 500</div>
    );
  }

}

export {PageRouter, LoginPage, UsersPage, Error404, Error500};
