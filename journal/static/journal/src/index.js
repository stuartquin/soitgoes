import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'
import {createStore, applyMiddleware, combineReducers } from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import constants from './constants';
import App from './app';
import {LandingContainer} from './components/landing';
import {TimeslipsContainer} from './components/timeslips';

const store = createStore(combineReducers({
  reducer: reducer,
  routing: routerReducer
}), applyMiddleware(thunk));

store.dispatch({
  type: constants.SET_STATE
});

const history = syncHistoryWithStore(browserHistory, store)

const routes = (
  <Route component={App}>
    <Route path='/' component={LandingContainer}>
      <Route path='/timeslips' component={TimeslipsContainer} />
    </Route>
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
