import 'babel-polyfill';
import 'es6-promise/auto';
import React from 'react';
import axios from 'axios';
import {Provider} from 'react-redux';
import {render} from 'react-dom';
import {Router, useRouterHistory} from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import createRoutes from './routes';
import configureStore from './store/configureStore';
import fetchData from './fetch-data';

const initialState = window.__INITIAL_STATE__;
const baseURL = window.__BASEURL__;
const rootElement = document.getElementById('root');
axios.defaults.baseURL = baseURL;

const store = configureStore(initialState, axios);
const history = useRouterHistory(createBrowserHistory)({basename: baseURL});
const routes = createRoutes(store);

render(
  <Provider store={store}>
    <Router history={history} onUpdate={onUpdate}>
      {routes}
    </Router>
  </Provider>,
  rootElement
);

function onUpdate() {
  const {components, params} = this.state;
  if (window.__INITIAL_STATE__ !== null) {
    return window.__INITIAL_STATE__ = null;
  }
  return fetchData(store.dispatch, components, params);
}
