import React from 'react';

import { applyElastiveMixin } from './elastive-mixin';
import { BasicPreview } from './preview';


@applyElastiveMixin({
  editableProps: ['style'],
  preview(props) {
    return <BasicPreview onClick={props.onClick} name="Container" />;
  }
})
export default class Container extends React.Component {

  static propTypes = {}

  static defaultProps = {
    style: {
      padding: '20px',
      margin: '10px',
      border: '1px solid black'
    }
  }

  render() {
    return <div style={this.props.style} onClick={ this.startEditing }>{this.props.children}</div>;
  }
}
