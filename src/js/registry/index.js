import React from 'react';
import _ from 'lodash';
import Im from 'immutable';
import $script from 'scriptjs';
import RSVP from 'rsvp';

import StandardComponentEditor from './components/component-editor';
import internalLibInfo from './components';


const libs = {
  __internal__: internalLibInfo
};


function getAllChildren(page) {
  let subChildren = Im.List();
  const children = page.get('children');
  if (!children) return null;
  children.forEach(child =>
    subChildren = subChildren.concat(getAllChildren(child))
  );
  return children.concat(subChildren);
}


export default {

  setupForPage(page) {
    const referencedComponents = getAllChildren(page);
    const promises = [];
    const pageLibs = page.get('componentLibraries');
    // Find all component libraries
    let componentLibraryURLs = referencedComponents.map(co => co.get('library')).toJS();
    if (pageLibs) componentLibraryURLs = componentLibraryURLs.concat(pageLibs.toJS());
    componentLibraryURLs = _.filter(_.uniq(componentLibraryURLs), Boolean);
    componentLibraryURLs.forEach(libURL => {
      // TODO - Allow refreshing of libs
      if (libs[libURL]) return;
      // Fetch the library
      const promise = new RSVP.Promise((resolve, reject) => {
        $script([libURL], () => {
          const libInfo = window.__latestElastiveLibrary__;
          if (!libInfo) throw new Error(`Could not load external library via ${libURL}`);
          libs[libURL] = libInfo;
          console.log("Loaded library:", libInfo);
          window.__latestElastiveLibrary__ = null;
          resolve();
        });
      });
      promises.push(promise);
    });
    return RSVP.all(promises);
  },

  getComponentByLibAndName(libId, componentName) {
    libId = libId || '__internal__';
    const lib = libs[libId];
    const componentInfo = lib.components[componentName];
    if (!componentInfo) {
      throw new Error(`${componentName} with library ${libId} does not exist in the registry`);
    }
    return componentInfo.component;
  },

  getEditorForComponent(component) {
    // TODO - Cache this
    let editor;
    let props;
    _.each(libs, (libInfo) => {
      _.each(libInfo.components, (coInfo) => {
        if (coInfo.component === component.constructor) {
          editor = coInfo.editor;
          props = coInfo.editableProps;
        }
      });
    });
    if (!editor) {
      editor = StandardComponentEditor;
    }
    return [editor, props];
  },

  getAllComponentInfo() {
    // TODO - Cache this
    const info = [];
    _.each(libs, (libInfo, url) => {
      _.each(libInfo.components, (coInfo, name) => {
        info.push({
          library: url,
          name
        });
      });
    });
    return info;
  }
};
