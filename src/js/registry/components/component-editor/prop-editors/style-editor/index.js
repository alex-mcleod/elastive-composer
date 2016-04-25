import React from 'react';
import _ from 'lodash';

import StringEditor from '../string-editor';


export default class StyleEditor extends React.Component {

  static propTypes = {
    update: React.PropTypes.func.isRequired,
    currentValue: React.PropTypes.object.isRequired
  }

  updateAttr = (attr, newValue) => {
    this.props.update(_.merge({}, this.props.currentValue, {
      [attr]: newValue
    }));
  }

  renderEditorForStyleAttr = (curVal, attr) => {
    return (
      <div key={attr}>
        <StringEditor
          name={attr} update={ (newVal) => this.updateAttr(attr, newVal) } currentValue={ curVal }
        />
      </div>
    );
  }

  render() {
    return (
      <div>
        {_.map(this.props.currentValue, this.renderEditorForStyleAttr)}
      </div>
    );
  }

}
