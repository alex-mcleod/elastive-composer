import React from 'react';

import { Types } from 'elastive-component';


export default class Container extends React.Component {

  static propTypes = {
    style: Types.style
  }

  static defaultProps = {
    style: {
      padding: '20px',
      margin: '10px',
      border: '1px solid black'
    }
  }

  render() {
    return <div style={this.props.style}>{this.props.children}</div>;
  }
}
