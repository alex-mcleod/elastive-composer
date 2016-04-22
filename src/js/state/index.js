import 'isomorphic-fetch';
import _ from 'lodash';

import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';

import api from './api';
import formReducer from './forms';
import Types from './types';


const reducers = _.merge(api.reducers, {
  form: formReducer
});


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);


export default {
  api,
  store,
  connect,
  Provider,
  Types
};
