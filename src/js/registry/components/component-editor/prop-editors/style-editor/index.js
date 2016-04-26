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

  showAddAttr = () => {
    this.setState({ showAddAttr: true, anchorEl: ReactDOM.findDOMNode(this.refs.add) });
  }

  updateAttr = (attr, newValue) => {
    this.props.update(_.merge({}, this.props.currentValue, {
      [attr]: newValue
    }));
  }

  renderEditorForStyleAttr = (curVal, attr) => {
    return (
      <div key={attr}>
        <AttrEditor
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
        <AttrSelector open={this.state.showAddAttr} onSelect={this.onNewAttrSelect} anchorEl={ this.state.anchorEl }/>
        {_.map(this.props.currentValue, this.renderEditorForStyleAttr)}
      </div>
    );
  }

}
