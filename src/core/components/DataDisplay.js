import JSPath from 'jspath';
import _ from 'lodash';
import React from 'react';
import {branch} from 'baobab-react/decorators';

@branch({
  cursors: {
    data: []
  }
})
export default class DataDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      mounted: false
    };
  }

  componentDidMount() {
    if (localStorage && localStorage.dataDisplay) {
      this.setState({
        mounted: true
      });
    }
  }

  filterByValue = (e) => {
    this.setState({query: e.target.value});
  }

  render() {
    if (!this.state.mounted) {
      return null;
    }

    let filtered = this.props.data;
    let invalidJSPath = false;
    if (!_.isEmpty(this.state.query)) {
      try {
        filtered = JSPath.apply(this.state.query, filtered);
        if (_.isEmpty(filtered)) {
          filtered = this.props.data;
        }
      } catch (e) {
        invalidJSPath = true;
      }
    }

    return (
      <div className='DataDisplay'>
        <input className='DataDisplay-Filter' type='text' placeholder=''
               onChange={this.filterByValue} />
        {invalidJSPath && 'Invalid JSPath'}
        <pre className='DataDisplay-Data'>
          {JSON.stringify(filtered, null, 2)}
        </pre>
      </div>
    );
  }

}
