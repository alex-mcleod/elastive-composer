import React from 'react';

import State from 'state';

import {Editor} from 'components/editor';


export class Home extends React.Component {

  render() {
    return <Editor siteId='hello-world' pageId='home' />;
  }
}
