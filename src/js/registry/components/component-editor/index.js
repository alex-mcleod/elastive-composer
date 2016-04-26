import React from 'react';
import Radium from 'radium';

import Style from 'style';

import {
  RaisedButton,
  Divider
} from 'material-ui';

import editors from './prop-editors';

const { PropTypes } = React;


function isType(type, typeName) {
  return type.typeName === typeName;
}


function getPropEditor(component, propName) {
  const type = component.constructor.propTypes[propName];
  if (isType(type, 'string')) {
    return editors.StringEditor;
  }
  if (isType(type, 'style')) {
    return editors.StyleEditor;
  }
  return null;
}


@Radium
export default class StandardComponentEditor extends React.Component {

  static propTypes = {
    updateProp: React.PropTypes.func.isRequired,
    deleteComponent: React.PropTypes.func.isRequired,
    component: React.PropTypes.object.isRequired,
    editableProps: React.PropTypes.array.isRequired
  }

  static styles = {
    container: {
      position: 'relative',
      height: '100%'
    },
    delete: {
      position: 'absolute',
      bottom: 100,
      left: 30
    },
    divider: {
      backgroundColor: Style.vars.colors.grey500,
      marginBottom: 20,
      marginTop: 20
    }
  }

  updateProp = (propName, newValue) => {
    this.props.updateProp(this.props.component, propName, newValue);
  }

  deleteComponent = () => {
    this.props.deleteComponent(this.props.component);
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
      <div>
        <Component
          key={editablePropName}
          update={(newVal) => {
            this.updateProp(editablePropName, newVal);
          }}
          name={editablePropName}
          currentValue={value}
        />
        <Divider style={this.constructor.styles.divider}/>
      </div>
    );
  }

  render() {
    const { component } = this.props;
    const editable = this.props.editableProps;
    return (
      <div style={this.constructor.styles.container}>
        {editable.map(this.renderEditableProp)}
        <RaisedButton
          style={this.constructor.styles.delete}
          onClick={this.deleteComponent}
          label="Delete"
        />
      </div>
    );
  }
}
