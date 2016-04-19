import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import RaisedButton from 'material-ui';


@Radium
export default class Save extends React.Component {

  static propTypes = {
    save: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      position: 'fixed',
      top: 0,
      right: 0
    }
  }

  save = () => {
    this.props.save();
  }

  render() {
    return (
      <RaisedButton label="Save" primary />
    );
  }

}
