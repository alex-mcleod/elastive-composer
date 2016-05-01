import React from 'react';
import _ from 'lodash';
import Radium from 'radium';
import Im from 'immutable';

import Style from 'style';
import State from 'state';
import Registry from 'registry';

import {
  FontIcon
} from 'material-ui';

const SPACING = 10;


@Radium
class Child extends React.Component {

  static propTypes = {
    child: React.PropTypes.instanceOf(Im.Map).isRequired,
    reference: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      padding: SPACING,
      cursor: 'pointer'
    },
    childrenContainer: {
      marginTop: SPACING,
      marginBottom: -SPACING
    },
    label: {
      paddingBottom: 5
    },
    icon: {
      fontSize: 12,
      marginRight: 5,
      color: Style.vars.colors.grey800
    }
  }

  constructor() {
    super();
    this.state = {
      open: true
    };
  }

  toggle = (evt) => {
    evt.stopPropagation();
    this.setState({ open: !this.state.open });
  }

  onSelect = () => {
    this.props.onSelect(this.props.reference);
  }

  render() {
    const children = this.props.child.get('children');
    const { open } = this.state;
    const icon = open ? 'keyboard_arrow_down' : 'keyboard_arrow_right';
    return (
      <div style={this.constructor.styles.container}>
        <div>
          <FontIcon
            style={this.constructor.styles.icon}å
            className="material-icons"
            onClick={ this.toggle }
          >
            { icon }
          </FontIcon>
          <span style={this.constructor.styles.label} onClick={this.onSelect}>
            { this.props.child.get('name') }
          </span>
        </div>
        {
          this.state.open && <div style={this.constructor.styles.childrenContainer}>
            {
              children.map((child, i) => {
                let ref = `${this.props.reference}.${i}`;
                return (
                  <Child key={ref} child={child} reference={ref} onSelect={this.props.onSelect} />
                );
              }).toJS()
            }
          </div>
        }
      </div>
    );
  }
}


@Radium
export default class Tree extends React.Component {

  static propTypes = {
    page: State.Types.Page,
    selectComponentWithReference: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      position: 'fixed',
      top: 56,
      left: 0,
      padding: 20,
      width: 150,
      height: '100%',
      backgroundColor: Style.vars.colors.grey300,
      borderRight: `1px solid ${Style.vars.colors.grey500}`
    }
  }

  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div style={this.constructor.styles.container}>
        {
          this.props.page.get('children').map((child, i) => {
            return (
              <Child
                key={i}
                child={child}
                reference={i.toString()}
                onSelect={this.props.selectComponentWithReference}
              />
            )
          }).toJS()
        }
      </div>
    );
  }

}
