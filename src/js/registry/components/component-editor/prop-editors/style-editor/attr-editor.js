import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import {
  TextField,
  AutoComplete,
  Popover
} from 'material-ui';


const attrs = [
  'Red',
  'Orange',
  'Yellow',
  'Green',
  'Blue',
  'Purple',
  'Black',
  'White',
];


@Radium
export class AttrSelector extends React.Component {

  static propTypes = {
    anchorEl: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool.isRequired
  }

  static styles = {
    input: {
      marginTop: -10,
      overflow: 'hidden'
    },
    popover: {
      overflowY: 'hidden',
      padding: 7
    }
  }

  onChange = (event) => {
    this.props.update(event.target.value);
  }

  render() {
    return (
      <Popover anchorEl={ this.props.anchorEl } open={this.props.open} style={this.constructor.styles.popover} autoCloseWhenOffScreen={false}>
        <AutoComplete
          floatingLabelText="Property"
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus
          dataSource={attrs}
          fullWidth
          style={this.constructor.styles.input}
        />
      </Popover>
    );
  }
}


@Radium
export class AttrEditor extends React.Component {

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
