import {createStore, applyMiddleware, combineReducers, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

import activityFeed from './reducers/activityfeed';
import user from './reducers/user';
import dash from './reducers/dash';
import nav from './reducers/nav';

import contacts from 'modules/contact';
import modifiers from 'modules/modifier';
import projects from 'modules/project';
import invoices from 'modules/invoice';
import timeslips from 'modules/timeslip';
import flashMessage from 'modules/flashmessage';
import tasks from 'modules/task';

const configureStore = (history) => {
  let middlewares = [
    applyMiddleware(
      thunk,
      routerMiddleware(history)
    )
  ];

  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    middlewares.push(window.__REDUX_DEVTOOLS_EXTENSION__());
  }

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
    flashMessage,
    router: routerReducer
  }),
  compose( ...middlewares )
  );
};

export default configureStore;
