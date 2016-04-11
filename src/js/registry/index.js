import _ from 'lodash';

import components from './components';


export default {
  getComponentWithName(componentName) {
    const component = components[componentName];
    if (!component) throw new Error(`${componentName} does not exist in the registry`);
    return component;
  },
  getEditorForComponent(component) {
    return component.constructor.elastiveMeta.editor;
  },
  getAllComponents() {
    return components;
  }
};
