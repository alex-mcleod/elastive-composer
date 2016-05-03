import React from 'react';
import _ from 'lodash';
import Im from 'immutable';
import Radium from 'radium';

import Style from 'style';
import State from 'state';
import Registry from 'registry';

import MainToolbar from './toolbar';
import EditableContainer from './editable-container';
import Tree from './tree';


@Radium
class Editor extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    pageId: React.PropTypes.string.isRequired
  }

  static styles = {
    pageContainer: {
      margin: '90px 215px',
      backgroundColor: 'white'
    },
    coEditorContainer: {
      position: 'fixed',
      top: 56,
      right: 0,
      padding: 20,
      width: 150,
      height: '100%',
      backgroundColor: Style.vars.colors.grey300,
      borderLeft: `1px solid ${Style.vars.colors.grey500}`
    }
  }

  constructor() {
    super();
    this.state = {
      editableProps: null,
      page: null,
      editCount: 0
    };
  }

  componentDidMount() {
    const { dispatch, pageId } = this.props;
    dispatch(State.api.actions.page.get(pageId));
  }

  componentWillReceiveProps(props) {
    if (props.page.get('children')) {
      Registry.setupForPage(props.page).then(() => {
        this.setState({
          page: props.page
        });
      });
    }
  }

  startNewComponentPlacement = (componentData) => {
    this.setState({ newComponentData: componentData, editableComponent: null });
  }

  addComponentLibrary = (libraryURL) => {
    let curLibraries = this.state.page.get('componentLibraries', Im.List());
    curLibraries = curLibraries.push(libraryURL);
    const page = this.state.page.set('componentLibraries', curLibraries);
    Registry.setupForPage(page).then(() => {
      this.setState({
        page
      });
    });
  }

  getEditableComponentRef() {
    return this.state.editableComponent ? this.state.editableComponent.props.reference : null;
  }

  onPageComponentClick = (component) => {
    if (this.state.newComponentData) {
      this.addNewChild(component, this.state.newComponentData);
    } else {
      this.setState({ editableComponent: component, editCount: this.state.editCount + 1 });
    }
  }

  selectComponentWithReference = (reference) => {
    const container = this.refs[`${reference}Container`];
    if (!container) {
      console.warn('Container for reference not available');
      return;
    }
    this.onPageComponentClick(container.refs.child);
  }

  getKeyPathForComponent(component) {
    const reference = component.props.reference;
    const refParts = reference.split('.');
    return _.flatten(_.map(refParts, (part) => ['children', part]));
  }

  addNewChild(component, newComponentData) {
    const keyPath = this.getKeyPathForComponent(component);
    const { library, name } = newComponentData;
    const newComponent = Registry.getComponentByLibAndName(library, name);
    keyPath.push('children');
    this.setState({
      page: this.state.page.updateIn(keyPath, Im.List(), (children) => children.push(Im.fromJS({
        name,
        library,
        props: newComponent.defaultProps || {},
        children: []
      }))),
      newComponentData: null
    });
  }

  deleteComponent = (component) => {
    const keyPath = this.getKeyPathForComponent(component);
    this.setState({
      page: this.state.page.deleteIn(keyPath)
    });
  }

  updateComponentProp = (component, propName, newValue) => {
    const keyPath = this.getKeyPathForComponent(component);
    keyPath.push('props');
    keyPath.push(propName);
    this.setState({
      page: this.state.page.setIn(keyPath, newValue)
    });
  }

  save = () => {
    this.props.dispatch(
      State.api.actions.page.update(this.props.pageId, this.state.page.toJS())
    );
  }

  renderComponentEditor() {
    let ComponentEditor, editable;
    if (this.state.editableComponent) {
      [ComponentEditor, editable] = Registry.getEditorForComponent(
        this.state.editableComponent
      );
    }
    // `editCount` key is required because otherwise if the same type of component
    // is edited twice in a row, component is not automatically updated
    return (
      <div style={this.constructor.styles.coEditorContainer}>
        { ComponentEditor && <ComponentEditor
          key={ this.state.editCount }
          component={this.state.editableComponent}
          editableProps={editable}
          updateProp={this.updateComponentProp}
          deleteComponent={this.deleteComponent}
        /> }
      </div>
    );
  }

  renderChildren(children, pageLoc = '') {
    if (!children) return null;
    if (_.isString(children)) return children;
    // TODO - Put this check into a function
    let editableRef = this.getEditableComponentRef();
    return _.map(children, (child, i) => {
      let Component = Registry.getComponentByLibAndName(child.library, child.name);
      let ref = pageLoc + i;
      return (
        <EditableContainer
          key={ref}
          ref={ref + 'Container'}
          startEditing={this.onPageComponentClick}
          isBeingEdited={editableRef === ref}
          showHoverHighlight={Boolean(this.state.newComponentData)}
        >
          <Component
            reference={ref}
            {...child.props}
          >
            {this.renderChildren(child.children, `${ref}.`)}
          </Component>
        </EditableContainer>
      );
    });
  }

  renderPage() {
    return <div>{this.renderChildren(this.state.page.get('children').toJS())}</div>;
  }

  render() {
    const { page } = this.state;
    const selectedRef = this.getEditableComponentRef();
    return (
      <div style={this.constructor.styles.container}>
        <MainToolbar
          save={this.save}
          startPlacement={this.startNewComponentPlacement}
          addComponentLibrary={this.addComponentLibrary}
        />
        { page && (
            <Tree
              page={page}
              selectComponentWithReference={this.selectComponentWithReference}
              selectedComponentRef={this.getEditableComponentRef()}
            />
          )
        }
        <div style={this.constructor.styles.pageContainer}>
          {page ? this.renderPage() : <h1>Loading...</h1>}
        </div>
        {this.renderComponentEditor()}
      </div>
    );
  }
}


function select(state) {
  return { page: state.page.data };
}


export default State.connect(select)(Editor);
