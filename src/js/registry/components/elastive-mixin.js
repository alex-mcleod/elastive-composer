import React from 'react';
import ReactMixin from 'react-mixin';
import _ from 'lodash';

import { StandardComponentEditor } from '../component-editor';


const BaseElastiveMixin = {

  propTypes: {
    startEditing: React.PropTypes.func.isRequired,
    style: React.PropTypes.object
  },
  
  elastiveMeta: {
    editor: StandardComponentEditor,
    preview: null
  },

  componentWillMount() {
    this.startEditing = this.startEditing.bind(this);
  },

  startEditing(evt) {
    evt.stopPropagation();
    this.props.startEditing(this);
  }
};


export function elastiveMixinFactory(meta) {
  return _.merge({}, BaseElastiveMixin, {
    elastiveMeta: _.merge({}, BaseElastiveMixin.elastiveMeta, meta)
  });
}


export function applyElastiveMixin(meta) {
  const mixin = elastiveMixinFactory(meta);
  return ReactMixin.decorate(mixin);
}
