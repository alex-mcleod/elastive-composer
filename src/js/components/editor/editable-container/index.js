import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Im from 'immutable';
import Radium from 'radium';

import Style from 'style';


@Radium
export default class EditableContainer extends React.Component {

  static propTypes = {
    startEditing: React.PropTypes.func.isRequired,
    showHoverHighlight: React.PropTypes.bool.isRequired,
    componentBeingEdited: React.PropTypes.object
  }

  static styles = {
    highlight: {
      outline: `1px solid ${Style.vars.colors.lightBlue500}`,
      position: 'fixed',
      // Prevents highlight from swallowing clicks
      pointerEvents: 'none',
      zIndex: 999
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

  renderHighlight() {
    const node = ReactDOM.findDOMNode(this.refs.child);
    const width = node.offsetWidth;
    const height = node.offsetHeight;
    const bounds = node.getBoundingClientRect();
    const style = _.merge(
      { width, height, top: bounds.top, left: bounds.left },
      this.constructor.styles.highlight
    );
    return (
      <div style={style} />
    );
  }

  render() {
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
      ref: 'child'
      // style: _.merge(
      //   {},
      //   child.props.style,
      //   showHighlight && styles.highlight
      // )
    });
    return (
      <span
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={this.startEditing}
      >
        {showHighlight && this.renderHighlight()}
        {child}
      </span>
    );
  }
}
