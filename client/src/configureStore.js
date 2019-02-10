import {
  createStore, applyMiddleware, combineReducers, compose
} from 'redux';
import thunk from 'redux-thunk';

import activityFeed from './reducers/activityfeed';
import user from './reducers/user';
import dash from './reducers/dash';

import contacts from 'modules/contact';
import modifiers from 'modules/modifier';
import projects from 'modules/project';
import invoices from 'modules/invoice';
import timeslips from 'modules/timeslip';
import flashMessage from 'modules/flashmessage';
import tasks from 'modules/task';
import nav from 'modules/nav';

const configureStore = () => {
  let middlewares = [
    applyMiddleware(
      thunk,
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
  }),
  compose( ...middlewares )
  );
};

export default configureStore;
