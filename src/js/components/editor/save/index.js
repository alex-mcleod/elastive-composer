import React from 'react';
import _ from 'lodash';
import Radium from 'radium';


@Radium
export default class Save extends React.Component {

  static propTypes = {
    save: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      position: 'fixed',
      top: 0,
      right: 0,
      padding: 10,
      backgroundColor: 'white',
      border: '1px solid black',
      cursor: 'pointer'
    }
  }

  save = () => {
    this.props.save()
  }

  render() {
    return (
      <div style={Save.styles.container} onClick={this.save}>
        Save
      </div>
    );
  }

}
