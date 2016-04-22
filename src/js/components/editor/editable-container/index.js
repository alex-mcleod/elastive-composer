import React from 'react';
import _ from 'lodash';
import Im from 'immutable';
import Radium from 'radium';

import Style from 'style';


console.log(Style);


@Radium
export default class EditableContainer extends React.Component {

  static propTypes = {
    startEditing: React.PropTypes.func.isRequired,
    showHoverHighlight: React.PropTypes.bool.isRequired,
    componentBeingEdited: React.PropTypes.object
  }

  static styles = {
    highlight: {
      outline: `1px solid ${Style.vars.colors.lightBlue500}`
    }
  }

  constructor() {
    super();
    this.state = {
      mouseOver: false
    };
  }

  startEditing = (evt) => {
    evt.stopPropagation();
    this.props.startEditing(this.refs.child);
  }

  onMouseOver = (evt) => {
    evt.stopPropagation();
    this.setState({
      mouseOver: true
    });
  }

  onMouseLeave = (evt) => {
    this.setState({
      mouseOver: false
    });
  }

  render() {
    const { styles } = this.constructor;
    let child = React.Children.only(this.props.children);
    let showHighlight;
    if (!this.props.showHoverHighlight) {
      if (this.refs && this.refs.child && this.refs.child === this.props.componentBeingEdited) {
        showHighlight = true;
      }
    } else if (this.props.showHoverHighlight && this.state.mouseOver) {
      showHighlight = true;
    }
    child = React.cloneElement(React.Children.only(this.props.children), {
      ref: 'child',
      style: _.merge(
        {},
        child.props.style,
        showHighlight && styles.highlight
      )
    });
    return <span
      onMouseOver={this.onMouseOver}
      onMouseLeave={this.onMouseLeave}
      onClick={this.startEditing}
    >{child}</span>;
  }
}
