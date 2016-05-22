import React from 'react';
import ReacDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import reducer from './reducer';
import constants from './constants';
import App from './app';
import {LandingContainer} from './components/landing';
import {TimeslipsContainer} from './components/timeslips';

const store = createStore(reducer, applyMiddleware(thunk));

store.dispatch({
  type: constants.SET_STATE
});

const routes = (
  <Route component={App}>
    <Route path='/' component={LandingContainer}>
      <Route path='/timeslips' component={TimeslipsContainer} />
    </Route>
  </Route>
);

ReacDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('root')
);
