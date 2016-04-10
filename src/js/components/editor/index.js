import React from 'react';
import _ from 'lodash';

import State from 'state';
import Registry from 'registry';


class EditorInner extends React.Component {

  static propTypes = {
    dispatch: React.PropTypes.func.isRequired,
    siteId: React.PropTypes.string.isRequired,
    pageId: React.PropTypes.string.isRequired
  }

  constructor() {
    super();
    this.state = {
      editableProps: null,
      page: null
    };
  }

  componentDidMount() {
    const { dispatch, siteId, pageId } = this.props;
    dispatch(State.api.actions.page(
      { siteId, pageId }
    ));
  }

  componentWillReceiveProps(props) {
    if (props.page.get('children')) {
      this.setState({
        page: props.page
      });
    }
  }

  startEditing = (component) => {
    this.setState({ editableComponent: component });
  }

  updateComponentProp = (propName, newValue) => {
    const reference = this.state.editableComponent.props.reference;
    const refParts = reference.split('.');
    const keyPath = _.flatten(_.map(refParts, (part) => ['children', part]));
    keyPath.push('props');
    keyPath.push(propName);
    this.setState({
      page: this.state.page.setIn(keyPath, newValue)
    });
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
    return ComponentEditor &&
      <ComponentEditor
        component={this.state.editableComponent} updateProp={this.updateComponentProp}
      />;
  }

  render() {
    const { page } = this.state;
    if (!page) return <h1>Loading...</h1>;
    return (
      <div>
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
