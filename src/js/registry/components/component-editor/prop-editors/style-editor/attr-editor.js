import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import {
  TextField,
  AutoComplete,
  Popover,
  FontIcon
} from 'material-ui';

import cssProps from './css-props';


@Radium
export class AttrSelector extends React.Component {

  static propTypes = {
    anchorEl: React.PropTypes.object.isRequired,
    open: React.PropTypes.bool.isRequired,
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
          menuProps={{ maxHeight: 400 }}
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
    remove: React.PropTypes.func.isRequired,
    currentValue: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  }

  static styles = {
    container: {
      position: 'relative'
    },
    icon: {
      fontSize: 12,
      position: 'absolute',
      top: 17,
      right: 3,
      cursor: 'pointer',
      zIndex: 1
    }
  }

  onChange = (event) => {
    let val = event.target.value;
    // Prevent react warning about unitless string
    // values
    const asInt = parseInt(val);
    if (!_.isNaN(asInt) && !/[a-z]/.test(val.toLowerCase())) {
      val = asInt;
    }
    this.props.update(val);
  }

  removeAttr = () => {
    this.props.remove();
  }

  focus() {
    this.refs.textField.input.focus();
  }

  render() {
    return (
      <div style={this.constructor.styles.container}>
        <FontIcon
          style={this.constructor.styles.icon} className="material-icons"
          onClick={this.removeAttr}
        >
          remove
        </FontIcon>
        <TextField
          floatingLabelText={ _.startCase(this.props.name) }
          style={this.constructor.styles.input}
          onChange={this.onChange}
          type="text"
          value={this.props.currentValue}
          onBlur={this.onBlur}
          fullWidth
          ref="textField"
        />
      </div>
    );
  }

}
