import _ from 'lodash';
import { generateValidation } from 'redux-form-validation';


const messages = {
  required: 'This field is required',
  url: 'Please enter a valid URL'
};


export default {
  getErrorMessage(validations, field) {
    let message;
    const fieldValidations = validations[field.name];
    const errors = field.error;
    if (!errors) return message;
    _.each(fieldValidations, (v, k) => {
      if (message) return;
      if (errors[k]) {
        message = messages[k];
        if (!message) console.warn(`Could not find error message for ${k}`);
      }
    });
    return message;
  },
  getFields(validations) {
    return _.keys(validations);
  },
  generateValidation
};
