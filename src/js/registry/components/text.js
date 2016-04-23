import React from 'react';

import { Types } from 'elastive-component';


// @applyElastiveMixin({
//   editableProps: ['text', 'style'],
//   name: 'Text'
// })
export default class Text extends React.Component {

  static propTypes = {
    text: Types.string,
    style: Types.style
  }

  static defaultProps = {
    text: 'New text',
    style: {}
  }

  render() {
    return (
      <p style={this.props.style}>
        {this.props.text}
      </p>
    );
  }
}
