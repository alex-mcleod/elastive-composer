import Im from 'immutable';
import reduxApi from 'redux-api';


function fetchAdapter(url, opts) {
  return fetch(url, opts).then((resp) => resp.json());
}


function transformer(data, prevData) {
  return Im.fromJS(data);
}

export default reduxApi({
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
