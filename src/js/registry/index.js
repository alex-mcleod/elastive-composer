import React from 'react';
import _ from 'lodash';
import Im from 'immutable';
import $script from 'scriptjs';
import RSVP from 'rsvp';

import internalComponents from './components';


const components = internalComponents;


function getAllChildren(page) {
  let subChildren = Im.List();
  let children = page.get('children');
  if (!children) return null;
  children.forEach(child =>
    subChildren = subChildren.concat(getAllChildren(child))
  );
  return children.concat(subChildren);
}


export default {
  setupForPage(page) {
    const referencedComponents = getAllChildren(page);
    const uniqueNames = _.uniq(referencedComponents.map(co => co.get('component')).toJS());
    const promises = [];
    uniqueNames.forEach(name => {
      if (!internalComponents[name]) {
        // Assume this is an external component
        const promise = new RSVP.Promise(function(resolve, reject) {
          $script([name], () => {
            const component = window.__latestElastiveComponent__;
            if (!component) throw new Error(`Could not load external component via ${name}`);
            components[name] = window.__latestElastiveComponent__;
            window.__latestElastiveComponent__ = null;
            resolve();
          });
        });
        promises.push(promise);
      }
    });
    return RSVP.all(promises);
  },
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
