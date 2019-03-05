import {
  createStore, applyMiddleware, combineReducers, compose
} from 'redux';
import thunk from 'redux-thunk';

import activityFeed from './reducers/activityfeed';
import user from './reducers/user';
import dash from './reducers/dash';

import contact from 'modules/contact';
import modifier from 'modules/modifier';
import project from 'modules/project';
import invoice from 'modules/invoice';
import timeslip from 'modules/timeslip';
import flashMessage from 'modules/flashmessage';
import task from 'modules/task';
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
    timeslip,
    project,
    invoice,
    task,
    user,
    dash,
    nav,
    contact,
    modifier,
    flashMessage,
  }),
  compose( ...middlewares )
  );
};

export default configureStore;
