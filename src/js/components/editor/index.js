import React from 'react';
import _ from 'lodash';
import Im from 'immutable';
import Radium from 'radium';

import State from 'state';
import Registry from 'registry';

import MainToolbar from './toolbar';
import EditableContainer from './editable-container';


@Radium
class Editor extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    pageId: React.PropTypes.string.isRequired
  }

  static styles = {
    container: {},
    pageContainer: {
      margin: '90px 25px',
      backgroundColor: 'white'
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

  onPageComponentClick = (component) => {
    if (this.state.newComponentData) {
      this.addNewChild(component, this.state.newComponentData);
    } else {
      this.setState({ editableComponent: component, editCount: this.state.editCount + 1 });
    }
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
    if (!this.state.editableComponent) return null;
    const [ComponentEditor, editable] = Registry.getEditorForComponent(
      this.state.editableComponent
    );
    // `editCount` key is required because otherwise if the same type of component
    // is edited twice in a row, component is not automatically updated
    return (
      <ComponentEditor
        key={ this.state.editCount }
        component={this.state.editableComponent}
        editableProps={editable}
        updateProp={this.updateComponentProp}
        deleteComponent={this.deleteComponent}
      />
    );
  }

  renderChildren(children, pageLoc = '') {
    if (!children) return null;
    if (_.isString(children)) return children;
    return _.map(children, (child, i) => {
      let Component = Registry.getComponentByLibAndName(child.library, child.name);
      let ref = pageLoc + i;
      return (
        <EditableContainer
          key={ref}
          startEditing={this.onPageComponentClick}
          componentBeingEdited={this.state.editableComponent}
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
    return (
      <div style={this.constructor.styles.container}>
        <MainToolbar
          save={this.save}
          startPlacement={this.startNewComponentPlacement}
          addComponentLibrary={this.addComponentLibrary}
        />
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
