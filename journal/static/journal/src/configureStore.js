import {createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { Iterable } from 'immutable';

import timeslips from './reducers/timeslips';
import projects from './reducers/projects';
import invoices from './reducers/invoices';
import user from './reducers/user';


const logger = createLogger({
  stateTransformer: (state) => {
    let newState = {};

    for (let i of Object.keys(state)) {
      if (Iterable.isIterable(state[i])) {
        newState[i] = state[i].toJS();
      } else {
        newState[i] = state[i];
      }
    }
    return newState;
  }
});

const configureStore = () => {
  return createStore(combineReducers({
    timeslips,
    projects,
    invoices,
    user,
    routing: routerReducer
  }),
  compose(
    applyMiddleware(
      thunk,
      routerMiddleware(browserHistory),
      logger
    ),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));
};

export default configureStore;
