import React from 'react';
import _ from 'lodash';
import Radium from 'radium';

import Registry from 'registry';


@Radium
export default class Library extends React.Component {

  static propTypes = {
    startPlacement: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      padding: 10,
      backgroundColor: 'white',
      border: '1px solid black',
      cursor: 'pointer'
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
  }

  renderClosed() {
    return (
      <div style={Library.styles.container} onClick={this.toggle}>
        Add Component
      </div>
    );
  }

  renderOpen() {
    return (
      <div style={Library.styles.container}>
        { _.map(Registry.getAllComponents(), (Component, name) => {
          const Preview = Component.elastiveMeta.preview;
          if (!Preview) {
            console.warn(`No preview component for '${name}'`);
            return null;
          }
          return <Preview key={name} onClick={ () => this.selectComponent(name) } />;
        })}
      </div>
    );
  }

  render() {
    if (this.state.open) {
      return this.renderOpen();
    }
    return this.renderClosed();
  }

}
