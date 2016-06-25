'use strict';

import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory, IndexRoute} from 'react-router';
import { push, syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import {createStore, applyMiddleware, combineReducers } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

import timeslips from './timeslips/reducer';
import projects from './projects/reducer';
import invoices from './invoices/reducer';
import constants from './constants';
import { App } from './app';
import { LoginContainer } from './login/logincontainer';
import { TimeslipsContainer} from './timeslips/timeslipcontainer';
import { NavContainer } from './nav/navcontainer';
import { InvoicesContainer } from './invoices/invoicescontainer';
import { InvoiceContainer } from './invoices/invoicecontainer';

import { Iterable } from 'immutable';

const logger = createLogger({
  stateTransformer: (state) => {
    let newState = {};

    for (var i of Object.keys(state)) {
      if (Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }
    return newState;
  }
});

const store = createStore(combineReducers({
  timeslips,
  projects,
  invoices,
  routing: routerReducer
}), applyMiddleware(thunk, routerMiddleware(browserHistory), logger));

store.dispatch({
  type: constants.SET_STATE
});

const history = syncHistoryWithStore(browserHistory, store);

const routes = (
  <Route path='/' component={App}>
    <Route component={NavContainer}>
      <Route path="invoices">
        <IndexRoute component={InvoicesContainer}/>
        <Route path=":id" component={InvoiceContainer}/>
      </Route>
      <Route path='timeslips' component={TimeslipsContainer} />
    </Route>
    <IndexRoute component={LoginContainer}/>
    <Route path='login' component={LoginContainer} />
  </Route>
);

ReacDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
