import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import State from 'state';


const theme = getMuiTheme();


export class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <State.Provider store={State.store}>
          {this.props.children}
        </State.Provider>
      </MuiThemeProvider>
    );
  }
}
