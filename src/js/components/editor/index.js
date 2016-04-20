import React from 'react';
import _ from 'lodash';
import Im from 'immutable';

import State from 'state';
import Registry from 'registry';

import MainToolbar from './toolbar';
import EditableContainer from './editable-container';


class EditorInner extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    pageId: React.PropTypes.string.isRequired
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

  startNewComponentPlacement = (componentName) => {
    this.setState({ newComponentName: componentName, editableComponent: null });
  }

  onPageComponentClick = (component) => {
    if (this.state.newComponentName) {
      this.addNewChild(component, this.state.newComponentName);
    } else {
      this.setState({ editableComponent: component, editCount: this.state.editCount + 1 });
    }
  }

  getKeyPathForComponent(component) {
    const reference = component.props.reference;
    const refParts = reference.split('.');
    return _.flatten(_.map(refParts, (part) => ['children', part]));
  }

  addNewChild(component, newComponentName) {
    const keyPath = this.getKeyPathForComponent(component);
    const newComponent = Registry.getComponentWithName(newComponentName);
    keyPath.push('children');
    this.setState({
      page: this.state.page.updateIn(keyPath, Im.List(), (children) => children.push(Im.fromJS({
        component: newComponentName,
        props: newComponent.defaultProps || {},
        children: []
      }))),
      newComponentName: null
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
    let ComponentEditor;
    if (this.state.editableComponent) {
      ComponentEditor = Registry.getEditorForComponent(this.state.editableComponent);
    }
    // `editCount` key is required because otherwise if the same type of component
    // is edited twice in a row, component is not automatically updated
    return ComponentEditor &&
      <ComponentEditor
        key={ this.state.editCount }
        component={this.state.editableComponent} updateProp={this.updateComponentProp}
        deleteComponent={this.deleteComponent}
      />;
  }

  renderChildren(children, pageLoc = '') {
    if (!children) return null;
    if (_.isString(children)) return children;
    return _.map(children, (child, i) => {
      let Component = Registry.getComponentWithName(child.component);
      let ref = pageLoc + i;
      return (
        <EditableContainer
          key={ref}
          startEditing={this.onPageComponentClick}
          componentBeingEdited={this.state.editableComponent}
          showHoverHighlight={Boolean(this.state.newComponentName)}
        >
          <Component
            name={child.component} reference={ref}
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
    if (!page) return <h1>Loading...</h1>;
    return (
      <div>
        <MainToolbar save={this.save} startPlacement={this.startNewComponentPlacement} />
        {this.renderPage()}
        {this.renderComponentEditor()}
      </div>
    );
  }
}


function select(state) {
  return { page: state.page.data };
}


export const Editor = State.connect(select)(EditorInner);
