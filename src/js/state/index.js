import 'isomorphic-fetch';
import Im from 'immutable';
import reduxApi, {transformers} from 'redux-api';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';

import Types from './types';


function fetchAdapter(url, opts) {
  return fetch(url, opts).then((resp) => resp.json());
}

function transformer(data, prevData) {
  return Im.fromJS(data);
}

const api = reduxApi({
  page: {
    url: `/pages/:id/`,
    transformer,
    options: {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    },
    helpers: {
      get(id) {
        return [{ id }, {}];
      },
      update(id, data) {
        const urlParams = { id };
        const params = { method: 'PATCH', body: JSON.stringify(data) };
        return [urlParams, params];
      }
    }
  }
}).use('rootUrl', 'http://localhost:8000/api/v1').use('fetch', fetchAdapter);


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(api.reducers);
const store = createStoreWithMiddleware(reducer);


export default {
  api,
  store,
  connect,
  Provider,
  Types
};
