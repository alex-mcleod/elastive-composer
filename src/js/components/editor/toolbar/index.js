import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import Style from 'style';

import {
  IconMenu,
  FontIcon,
  RaisedButton,
  Toolbar,
  ToolbarGroup,
  ToolbarTitle
} from 'material-ui';

import Insert from './insert';


@Radium
export default class MainToolbar extends React.Component {

  static propTypes = {
    save: React.PropTypes.func.isRequired,
    startPlacement: React.PropTypes.func.isRequired,
    addComponentLibrary: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      backgroundColor: Style.vars.colors.grey300,
      borderBottom: `1px solid ${Style.vars.colors.grey500}`
    }
  }

  save = () => {
    this.props.save();
  }

  render() {
    return (
      <Toolbar style={this.constructor.styles.container}>
        <ToolbarGroup firstChild float="left">
          <Insert
            startPlacement={this.props.startPlacement}
            addComponentLibrary={this.props.addComponentLibrary}
          />
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <RaisedButton
            label="Save" secondary onMouseUp={this.props.save}
          />
        </ToolbarGroup>
      </Toolbar>
    );
  }

}
