import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import {
  TextField,
  AutoComplete,
  Popover
} from 'material-ui';

import cssProps from './css-props';


@Radium
export class AttrSelector extends React.Component {

  static propTypes = {
    anchorEl: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool.isRequired,
    update: React.PropTypes.func.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    onRequestClose: React.PropTypes.func.isRequired
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

  componentDidUpdate(oldProps) {
    if (!oldProps.open && this.props.open) {
      _.delay(() => {
        this.refs.autoComplete.refs.searchTextField.input.focus();
      }, 250);
    }
  }

  onChange = (event) => {
    this.props.update(event.target.value);
  }

  onSelect = (attr) => {
    this.props.onSelect(_.camelCase(attr));
  }

  render() {
    return (
      <Popover
        anchorEl={ this.props.anchorEl }
        open={this.props.open}
        style={this.constructor.styles.popover}
        autoCloseWhenOffScreen={false}
        onRequestClose={this.props.onRequestClose}
      >
        <AutoComplete
          floatingLabelText="Property"
          ref="autoComplete"
          filter={AutoComplete.caseInsensitiveFilter}
          openOnFocus
          dataSource={cssProps}
          fullWidth
          onNewRequest={this.onSelect}
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

  focus() {
    this.refs.textField.input.focus();
  }

  render() {
    return (
      <div>
        <TextField
          floatingLabelText={ _.startCase(this.props.name) } style={this.constructor.styles.input}
          onChange={this.onChange} type="text" value={this.props.currentValue}
          ref="textField"
        />
      </div>
    );
  }

}
