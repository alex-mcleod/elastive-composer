import React from 'react';

import State from 'state';


export class App extends React.Component {
  render() {
    return (
      <div>
        <State.Provider store={State.store}>
          {this.props.children}
        </State.Provider>
      </div>
    );
  }
}
