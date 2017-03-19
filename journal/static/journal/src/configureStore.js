import {createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { Iterable } from 'immutable';

import timeslips from './reducers/timeslips';
import activityFeed from './reducers/activityfeed';
import projects from './reducers/projects';
import invoice from './reducers/invoice';
import invoices from './reducers/invoices';
import user from './reducers/user';
import dash from './reducers/dash';
import tasks from './reducers/tasks';
import nav from './reducers/nav';
import contacts from './reducers/contacts';
import companies from './modules/company';


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
    invoice,
    invoices,
    user,
    dash,
    tasks,
    nav,
    contacts,
    companies,
    routing: routerReducer
  }),
  compose( ...middlewares )
  );
};

export default configureStore;
