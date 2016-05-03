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
    isBeingEdited: React.PropTypes.bool.isRequired
  }

  static styles = {
    container: {
      cursor: 'pointer'
    },
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

  componentDidUpdate() {
    const node = ReactDOM.findDOMNode(this.refs.child);
    const highlightAttrs = this.getHighlightAttrs(node);
    if (!_.isEqual(highlightAttrs, this.state.highlightAttrs)) {
      this.setState({ highlightAttrs });
    }
  }

  getHighlightAttrs(node) {
    const bounds = node.getBoundingClientRect();
    return {
      width: node.offsetWidth,
      height: node.offsetHeight,
      top: bounds.top,
      left: bounds.left
    }
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

  getChild() {
    return this.refs.child;
  }

  renderHighlight() {
    const highlightAttrs = this.state.highlightAttrs;
    if (!highlightAttrs) return null;
    const style = _.merge(
      {},
      this.constructor.styles.highlight,
      highlightAttrs
    );
    return (
      <div style={style} />
    );
  }

  render() {
    let child = React.Children.only(this.props.children);
    let showHighlight;
    if (!this.props.showHoverHighlight) {
      if (this.props.isBeingEdited) {
        showHighlight = true;
      }
    } else if (this.props.showHoverHighlight && this.state.mouseOver) {
      showHighlight = true;
    }
    child = React.cloneElement(React.Children.only(this.props.children), {
      ref: 'child'
    });
    return (
      <span
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        onClick={this.startEditing}
        style={this.constructor.styles.container}
      >
        {showHighlight && this.renderHighlight()}
        {child}
      </span>
    );
  }
}
