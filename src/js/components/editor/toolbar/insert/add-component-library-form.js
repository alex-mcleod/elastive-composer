import React, { Component, PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import formUtil from 'util/form';
import {
  TextField
} from 'material-ui';


const validations = {
  URL: {
    required: true,
    url: true
  }
};

const fields = formUtil.getFields(validations);


class AddComponentLibraryForm extends Component {

  static propTypes = {
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired
  }

  render() {
    const {
      fields: { URL },
      handleSubmit
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <TextField
          {...URL}
          floatingLabelText="Library URL"
          errorText={formUtil.getErrorMessage(validations, URL)}
        />
      </form>
    );
  }
}


export default reduxForm({
  form: 'addComponentLibrary',
  fields,
  ...formUtil.generateValidation(validations)
})(AddComponentLibraryForm);
