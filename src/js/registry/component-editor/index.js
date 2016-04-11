import React from 'react';
import Radium from 'radium';

import editors from './prop-editors';


function getPropEditor(component, propName) {
  const type = component.constructor.propTypes[propName];
  const { PropTypes } = React;
  if (type === PropTypes.string || type === PropTypes.string.isRequired) {
    return editors.StringEditor;
  }
  if ((type === PropTypes.object || type === PropTypes.object.isRequired) && propName === 'style') {
    return editors.StyleEditor;
  }
  return null;
}


@Radium
export class StandardComponentEditor extends React.Component {

  static propTypes = {
    updateProp: React.PropTypes.func.isRequired,
    component: React.PropTypes.object
  }

  static styles = {
    container: {
      position: 'fixed',
      bottom: '0px',
      right: '0px',
      padding: '20px',
      backgroundColor: 'white',
      border: '1px solid black'
    }
  }

  updateProp = (propName, newValue) => {
    this.props.updateProp(propName, newValue);
  }

  renderEditableProp = (editablePropName) => {
    const value = this.props.component.props[editablePropName];
    // TODO
    const Component = getPropEditor(this.props.component, editablePropName);
    if (!Component) {
      console.warn(`No edit component for '${editablePropName}' prop`);
      return null;
    }
    return (
      <Component
        key={editablePropName}
        update={(newVal) => {
          this.updateProp(editablePropName, newVal);
        }}
        name={editablePropName}
        currentValue={value}
      />
    );
  }

  render() {
    const { component } = this.props;
    if (!component) return null;
    const editable = component.constructor.elastiveMeta.editableProps;
    return (
      <div style={StandardComponentEditor.styles.container}>
        {editable.map(this.renderEditableProp)}
      </div>
    );
  }
}
