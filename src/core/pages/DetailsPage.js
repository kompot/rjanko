import React from 'react';
import _ from 'lodash';
import {branch} from 'baobab-react/decorators';
import Form from 'react-formal';
// no axios in components!
import axios from 'axios';

const debug = require('core/logging/debug')(__filename);

import models from 'models';
import {Component} from 'core/components/Component';

Form.addInputTypes(require('react-formal-inputs'));

@branch({
  cursors: {
    details: ['admin', 'details'],
    entityId: ['route', 'params', 'id']
  }
})
export default class DetailsPage extends Component {

  getDataPath() {
    return ['admin', 'details', this.props.entity, this.props.entityId];
  }

  constructor(props) {
    super(props);
    this.state = {
      model: {},
      refData: {}
    };
  }

  updateFormValue = (model) => {
    this.setState({model});
  };

  colorOnChange = (v) => {
    console.log('_______colorOnChange', v);
  };

  colorSearch = v => console.log('_______ colorSearch', v);

  saveForm = async () => {
    debug('_________', this.state.model);
    const res = await axios.post(`/api/${this.props.entity}/${this.props.entityId}`, this.state.model);
    debug('_________ after save', res);
  };

  getChildren = (schema, field, i) => {
    if (schema.fields[field].fields) {
      return (
          <div style={{border: '1px solid green', paddingLeft: '10px'}} key={i}>
            {this.renderForm(schema.fields[field], field)}
          </div>
      );
    }
    return null;
  };

  getLabel = (schema, field) => {
    const l = schema.fields[field].label();
    if (_.isString(l)) {
      return l;
    }
    return null;
  };

  renderForm = (schema, parentFieldName = '') => {
    return (
        <div>
          {Object.keys(schema.fields).map((field, i) => {
            const children = this.getChildren(schema, field, i);
            if (children) {
              return children;
            }
            const fieldName = _.compact([parentFieldName, field]).join('.');
            const extraProps = {};
            if (schema.fields[field]._type === 'array' && schema.fields[field]._subType.isModel() === true) {
              const subTypeModel = schema.fields[field]._subType.modelName().toLowerCase();

              extraProps.type = 'multiselect';
              extraProps.valueField = '_id';
              extraProps.textField = 'name';
              extraProps.data = this.state.refData[subTypeModel];
              extraProps.onSearch = async (v) => {
                const result = await axios.get(`/api/${subTypeModel}?search=${v}`);
                this.setState({
                  refData: {
                    [subTypeModel]: result.data
                  }
                });
              };
            }
            return (
                <div style={{border: '1px solid red', paddingLeft: '10px'}} key={i}>
                  <div>
                    <span>{field}</span> -
                    <span>{this.getLabel(schema, field)}</span>
                  </div>
                  <Form.Field name={fieldName} {...extraProps} />
                  <Form.Message for={fieldName} />
                </div>
            );
          })}
        </div>
    );
  };

  renderLoaded() {
    const {entity} = this.props;
    const value = this.tree.select(this.getDataPath()).get();

    return (
      <div>
        DetailsPage {entity}

        <Form
            schema={models[entity]}
            defaultValue={value[0]}
            onChange={model => this.updateFormValue(model)}
            >
          {this.renderForm(models[entity])}
          <Form.Button onClick={this.saveForm} type='submit'>
            Submit
          </Form.Button>
        </Form>

      </div>
    );
  }

}
