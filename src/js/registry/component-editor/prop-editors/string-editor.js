import React from 'react';


export default class StringEditor extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    update: React.PropTypes.func.isRequired,
    currentValue: React.PropTypes.string.isRequired
  }

  onChange = (event) => {
    this.props.update(event.target.value);
  }

  render() {
    return (
      <div>
        <p>{ this.props.name }</p>
        <input onChange={this.onChange} type="text" defaultValue={this.props.currentValue} />
      </div>
    );
  }

}
