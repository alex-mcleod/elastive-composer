import React from 'react';
import Radium from 'radium';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import State from 'state';


const theme = getMuiTheme();


@Radium
export class App extends React.Component {

  static styles = {
    container: {
      fontFamily: 'Roboto, sans-serif'
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <State.Provider store={State.store}>
          <div style={this.constructor.styles.container}>
            {this.props.children}
          </div>
        </State.Provider>
      </MuiThemeProvider>
    );
  }
}
