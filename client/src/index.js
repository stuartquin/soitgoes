'use strict';
// http://boooya.aqvatarius.com/pages-payment-invoice.html

import React from 'react';
import ReacDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import createHistory from 'history/createBrowserHistory'

import constants from './constants';
import configureStore from './configureStore';

import AppContainer from './app';

const history = createHistory();
const store = configureStore(history);

store.dispatch({
  type: constants.SET_STATE
});

ReacDOM.render(
  <Provider store={store}>
    <Router>
      <Route path="/" component={AppContainer} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
