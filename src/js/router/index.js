import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

import {App} from 'components/app';
import {Home} from 'components/home';


function NoMatch() {
  return <h1>No matching route</h1>;
}


export default function() {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="*" component={NoMatch}/>
      </Route>
    </Router>
  )
}
