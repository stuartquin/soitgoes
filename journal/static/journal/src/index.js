import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import { push, syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import {createStore, applyMiddleware, combineReducers } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import constants from './constants';
import { App } from './app';
import { LoginContainer } from './components/login';
import { TimeslipsContainer} from './components/timeslips';
import { getUserAuth } from './services/user';

const store = createStore(combineReducers({
  reducer: reducer,
  routing: routerReducer
}), applyMiddleware(thunk, routerMiddleware(browserHistory)));

store.dispatch({
  type: constants.SET_STATE
});

const history = syncHistoryWithStore(browserHistory, store);

const routes = (
  <Route path='/' component={App}>
    <Route path='/login' component={LoginContainer} />
    <Route path='/timeslips' component={TimeslipsContainer} />
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
