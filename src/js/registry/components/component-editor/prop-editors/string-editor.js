import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import {
  TextField
} from 'material-ui';


@Radium
export default class StringEditor extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired,
    currentValue: React.PropTypes.string.isRequired
  }

  static styles = {
    input: {
      width: 'initial'
    }
  }

  onChange = (event) => {
    this.props.update(event.target.value);
  }

  render() {
    return (
      <div>
        <TextField
          floatingLabelText={ _.capitalize(this.props.name) } style={this.constructor.styles.input}
          onChange={this.onChange} type="text" value={this.props.currentValue}
        />
      </div>
    );
  }

}
