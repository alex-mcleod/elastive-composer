import React from 'react';
import _ from 'lodash';
import Im from 'immutable';

import State from 'state';
import Registry from 'registry';

import Library from './library';
import Save from './save';


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
      this.setState({
        page: props.page
      });
    }
  }

  getKeyPathForComponent(component) {
    const reference = component.props.reference;
    const refParts = reference.split('.');
    return _.flatten(_.map(refParts, (part) => ['children', part]));
  }

  startNewComponentPlacement = (componentName) => {
    this.setState({ newComponentName: componentName });
  }

  startEditing = (component) => {
    console.log(component);
    if (this.state.newComponentName) {
      this.addNewChild(component, this.state.newComponentName);
    } else {
      this.setState({ editableComponent: component, editCount: this.state.editCount + 1 });
    }
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

  updateComponentProp = (propName, newValue) => {
    const keyPath = this.getKeyPathForComponent(this.state.editableComponent);
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

  renderChildren(children, pageLoc = '') {
    if (!children) return null;
    if (_.isString(children)) return children;
    return _.map(children, (child, i) => {
      let Component = Registry.getComponentWithName(child.component);
      let ref = pageLoc + i;
      return (
        <Component
          name={child.component} reference={ref} key={ref}
          {...child.props} startEditing={this.startEditing}
        >
          {this.renderChildren(child.children, `${ref}.`)}
        </Component>
      );
    });
  }

  renderPage() {
    return <div>{this.renderChildren(this.state.page.get('children').toJS())}</div>;
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
      />;
  }

  render() {
    const { page } = this.state;
    if (!page) return <h1>Loading...</h1>;
    return (
      <div>
        <Save save={this.save} />
        <Library startPlacement={this.startNewComponentPlacement} />
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
