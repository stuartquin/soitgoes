import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import { push, syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import {createStore, applyMiddleware, combineReducers } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import timeslips from './timeslips/timeslipreducer';
import constants from './constants';
import { App } from './app';
import { LoginContainer } from './login/logincontainer';
import { TimeslipsContainer} from './timeslips/timeslipcontainer';
import { NavContainer } from './nav/navcontainer';
import { InvoicesContainer } from './invoices/invoicecontainer';
import { getUserAuth } from './services/user';

const store = createStore(combineReducers({
  reducer,
  timeslips,
  routing: routerReducer
}), applyMiddleware(thunk, routerMiddleware(browserHistory)));

store.dispatch({
  type: constants.SET_STATE
});

const history = syncHistoryWithStore(browserHistory, store);

const routes = (
  <Route component={App}>
    <Route component={NavContainer}>
      <Route path='invoices' component={InvoicesContainer} />
      <Route path='timeslips' component={TimeslipsContainer} />
    </Route>
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

const userAuth = getUserAuth();
if (userAuth) {
  store.dispatch(push('/timeslips'));
} else {
  store.dispatch(push('/login'));
}
