import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import Radium from 'radium';

import Style from 'style';

import {
  FontIcon
} from 'material-ui';

import { AttrSelector, AttrEditor } from './attr-editor';


@Radium
export default class StyleEditor extends React.Component {

  static propTypes = {
    update: React.PropTypes.func.isRequired,
    currentValue: React.PropTypes.object.isRequired
  }

  static styles = {
    heading: {
      marginBottom: 10,
      marginTop: 10,
      color: Style.vars.colors.grey800
    },
    icon: {
      float: 'right',
      fontSize: 18,
      cursor: 'pointer'
    }
  }

  constructor() {
    super();
    this.state = {
      showAddAttr: false
    };
  }

  componentDidUpdate() {
    const lastAttr = this.state.lastAddedAttr;
    if (lastAttr) {
      const editor = this.refs[`${lastAttr}Editor`];
      // Focus on new attr editor if we just added it
      _.defer(() => editor.focus());
      this.setState({ lastAddedAttr: null });
    }
  }

  showAddAttr = () => {
    this.setState({ showAddAttr: true, anchorEl: ReactDOM.findDOMNode(this.refs.add) });
  }

  updateAttr = (attr, newValue) => {
    this.props.update(_.merge({}, this.props.currentValue, {
      [attr]: newValue
    }));
  }

  onNewAttrSelect = (attr) => {
    // Will create a new attr on style object
    this.updateAttr(attr, '');
    this.setState({ showAddAttr: false, lastAddedAttr: attr });
  }

  renderEditorForStyleAttr = (curVal, attr) => {
    return (
      <div key={attr}>
        <AttrEditor
          ref={`${attr}Editor`}
          name={attr} update={ (newVal) => this.updateAttr(attr, newVal) } currentValue={ curVal }
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        <h5 style={this.constructor.styles.heading}>
          Style
          <FontIcon ref="add" style={this.constructor.styles.icon} className="material-icons" onClick={this.showAddAttr}>
            add
          </FontIcon>
        </h5>
        <AttrSelector
          open={this.state.showAddAttr}
          onSelect={this.onNewAttrSelect}
          anchorEl={ this.state.anchorEl }
          onRequestClose={ () => this.setState({ showAddAttr: false })}
        />
        {_.map(this.props.currentValue, this.renderEditorForStyleAttr)}
      </div>
    );
  }

}
