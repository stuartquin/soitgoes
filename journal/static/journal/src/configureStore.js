import {createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { Iterable } from 'immutable';

import activityFeed from './reducers/activityfeed';
import user from './reducers/user';
import dash from './reducers/dash';
import nav from './reducers/nav';

import contacts from 'modules/contact';
import modifiers from 'modules/modifier';
import projects from 'modules/project';
import invoices from 'modules/invoice';
import timeslips from 'modules/timeslip';
import tasks from 'modules/task';

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

let middlewares = [
  applyMiddleware(
    thunk,
    routerMiddleware(browserHistory)
  )
];

if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const configureStore = () => {
  return createStore(combineReducers({
    activityFeed,
    timeslips,
    projects,
    invoices,
    user,
    dash,
    tasks,
    nav,
    contacts,
    modifiers,
    routing: routerReducer
  }),
  compose( ...middlewares )
  );
};

export default configureStore;
