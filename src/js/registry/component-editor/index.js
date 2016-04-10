import React from 'react';


class StringEditor extends React.Component {

  onChange = (event) => {
    this.props.update(event.target.value);
  }

  render() {
    return <input onChange={this.onChange} type="text" defaultValue={this.props.currentValue} />;
  }

}


const TYPES_TO_COMPONENT = {
  string: StringEditor
}


export class StandardComponentEditor extends React.Component {

  static propTypes = {
    component: React.PropTypes.object
  }

  updateProp = (propName, newValue) => {
    this.props.updateProp(propName, newValue);
  }

  renderEditableProp = (editablePropName) => {
    const value = this.props.component.props[editablePropName];
    // TODO
    const Component = TYPES_TO_COMPONENT['string'];
    return <Component
      key={editablePropName}
      update={(newVal)=>{
        this.updateProp(editablePropName, newVal)
      }}
      currentValue={value}
    />
  }

  render() {
    const {component} = this.props;
    if (!component) return null;
    const editable = component.constructor.editableProps;
    return (
      <div style={{position: 'fixed', bottom: '0px', right: '0px', padding: '20px'}}>
        {editable.map(this.renderEditableProp)}
      </div>
    )
  }
}
