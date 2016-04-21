import React from 'react';
import ReactTransitionGroup from 'react-addons-transition-group';
import _ from 'lodash';
import Radium from 'radium';

import {
  Menu,
  MenuItem,
  FontIcon,
  RaisedButton,
  Dialog,
  FlatButton,
  Popover
} from 'material-ui';
import Formsy from 'formsy-react';
import { FormsyText } from 'formsy-material-ui';

import Registry from 'registry';


@Radium
export default class Insert extends React.Component {

  static propTypes = {
    startPlacement: React.PropTypes.func.isRequired
  }

  static styles = {
    container: {
      margin: '10px 24px'
    }
  }

  constructor() {
    super();
    this.state = {
      open: false,
      dialogOpen: false,
      canSubmit: false
    };
  }

  openMenu = (event) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  }

  closeMenu = () => {
    this.setState({ open: false, anchorEl: null });
  }

  showAddComponentsDialog = () => {
    this.setState({ dialogOpen: true });
    this.closeMenu();
  }

  closeDialog = () => {
    this.setState({ dialogOpen: false });
  }

  selectComponent(name) {
    this.props.startPlacement(name);
    this.setState({ open: false });
  }

  enableSubmit = () => {
    this.setState({
      canSubmit: true,
    });
  }

  disableSubmit = () => {
    this.setState({
      canSubmit: false,
    });
  }

  submitForm = (data) => {
    alert(JSON.stringify(data, null, 4));
  }

  notifyFormError(data) {
    console.error('Form error:', data);
  }

  renderMenu() {
    return (
      <Menu listStyle={{backgroundColor: 'white'}}>
        { _.map(Registry.getAllComponents(), (component, id) => {
          const displayName = component.elastiveMeta.name || id;
          return (
            <MenuItem
              key={id} primaryText={displayName} onMouseUp={() => this.selectComponent(id)}
            />
          );
        })}
        <MenuItem primaryText="Add component library..." onMouseUp={this.showAddComponentsDialog} />
      </Menu>
    );
  }

  render() {
    const actions = [
      <FlatButton
        label="OK"
        primary
        keyboardFocused
        onTouchTap={this.closeDialog}
      />,
    ];
    return (
      <div style={this.constructor.styles.container}>
        <RaisedButton
          label="Insert"
          primary icon={<FontIcon className="material-icons">add_box</FontIcon>}
          onMouseUp={this.openMenu}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.closeMenu}
        >
          <Menu>
            { _.map(Registry.getAllComponents(), (component, id) => {
              const displayName = component.elastiveMeta.name || id;
              return (
                <MenuItem
                  key={id} primaryText={displayName} onMouseUp={() => this.selectComponent(id)}
                />
              );
            })}
            <MenuItem primaryText="Add component library..." onMouseUp={this.showAddComponentsDialog} />
          </Menu>
        </Popover>
        <Dialog
          title="Add component library"
          actions={actions}
          modal
          open={this.state.dialogOpen}
        >
          Enter the URL of an Elastive component library. Should be in the form of
          a single JS file.

          <Formsy.Form
            onValid={this.enableSubmit}
            onInvalid={this.disableSubmit}
            onValidSubmit={this.submitForm}
            onInvalidSubmit={this.notifyFormError}
          >
            <FormsyText
              name="url"
              validations="isUrl"
              validationError="Please enter a valid URL"
              required
              floatingLabelText="Library URL"
            />
            <RaisedButton
              type="submit"
              label="Submit"
              disabled={!this.state.canSubmit}
            />
          </Formsy.Form>
        </Dialog>
      </div>
    );
  }

}
