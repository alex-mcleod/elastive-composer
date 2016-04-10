import React from 'react';

import {StandardComponentEditor} from './component-editor'


class Text extends React.Component {

  static propTypes = {
    startEditing: React.PropTypes.func.isRequired,
    text: React.PropTypes.string.isRequired
  }

  static editableProps = ['text']

  static editComponent = StandardComponentEditor

  render() {
    return <p style={this.props.style} onClick={() => {this.props.startEditing(this)}}>
      {this.props.text}
    </p>
  }
}


class Container extends React.Component {

  static propTypes = {
    startEditing: React.PropTypes.func.isRequired
  }

  render() {
    return <div style={this.props.style}>{this.props.children}</div>;
  }
}


const components = {
  Text: Text,
  Container: Container
}


export default {
  getComponentWithName(componentName) {
    let component = components[componentName];
    if (!component) throw new Error(`${componentName} does not exist in the registry`);
    return component;
  },
  getEditorForComponent(component) {
    return component.constructor.editComponent;
  }
}
