import 'isomorphic-fetch';
import Im from 'immutable';
import reduxApi, {transformers} from 'redux-api';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, connect } from 'react-redux';


function fetchAdapter(url, opts) {
  return fetch(url, opts).then((resp) => resp.json());
}


const api = reduxApi({
  page: {
    url:`/sites/:siteId/pages/:pageId.json`,
    transformer: Im.fromJS
  }
}).use('rootUrl', 'http://localhost:8080').use('fetch', fetchAdapter);


const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(api.reducers);
const store = createStoreWithMiddleware(reducer);


export default {
  api,
  store,
  connect,
  Provider
};
