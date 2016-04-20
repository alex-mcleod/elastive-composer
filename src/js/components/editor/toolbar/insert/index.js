import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import _ from 'lodash';
import Radium from 'radium';

import {
  Menu,
  MenuItem,
  FontIcon,
  RaisedButton
} from 'material-ui';

import Registry from 'registry';


@Radium
export default class Insert extends React.Component {

  static propTypes = {
    startPlacement: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      margin: '10px 24px'
    }
  }

  constructor() {
    super();
    this.state = {
      open: false
    };
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  }

  selectComponent(name) {
    this.props.startPlacement(name);
    this.setState({ open: false });
  }

  renderMenu() {
    return (
      <Menu>
        { _.map(Registry.getAllComponents(), (component, id) => {
          const displayName = component.elastiveMeta.name || id;
          return <MenuItem
            key={id} primaryText={displayName} onMouseUp={() => this.selectComponent(id)}
          />;
        })}
      </Menu>
    );
  }

  render() {
    return (
      <div style={this.constructor.styles.container}>
        <RaisedButton
          label="Insert"
          primary icon={<FontIcon className="material-icons">add_box</FontIcon>}
          onMouseUp={this.toggle}
        />
        <ReactTransitionGroup>
          { this.state.open && this.renderMenu() }
        </ReactTransitionGroup>
      </div>
    );
  }

}
