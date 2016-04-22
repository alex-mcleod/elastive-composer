import _ from 'lodash';
import {reducer as formReducer} from 'redux-form';


const HTTP = 'http://';
const HTTPS = 'https://';


function normalizeURL(value) {
  if (!value || !(value.length >= HTTPS.length)) {
    return value;
  }
  if (!_.startsWith(value, HTTP) && !_.startsWith(value, HTTPS)) {
    return HTTP + value;
  }
  return value;
}


export default formReducer.normalize({
  addComponentLibrary: {
    URL: normalizeURL
  }
});
