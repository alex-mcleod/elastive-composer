import React from 'react';

import { applyElastiveMixin } from './elastive-mixin';
import { BasicPreview } from './preview';


@applyElastiveMixin({
  editableProps: ['text', 'style'],
  preview(props) {
    return <BasicPreview onClick={props.onClick} name="Text" />;
  }
})
export default class Text extends React.Component {

  static propTypes = {
    text: React.PropTypes.string
  }

  static defaultProps = {
    text: 'New text',
    style: {}
  }

  render() {
    return (
      <p style={this.props.style} onClick={ this.startEditing }>
        {this.props.text}
      </p>
    );
  }
}
