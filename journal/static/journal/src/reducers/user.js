'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import constants from '../constants';

const view = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case constants.GET_USER_START:
    return state.set('isLoading', true);
  case constants.GET_USER_SUCCESS:
    return state.set('isLoading', false);
  default:
    return state;
  }
};

const user = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case constants.GET_USER_SUCCESS:
    return Immutable.fromJS(action.user);
  default:
    return state;
  }
};

const setVersion = (state, action) => {
  const version = Immutable.fromJS(action.version);
  const isNew = state.get('hash') && state.get('hash') !== version.get('hash');
  return version.set('isNew', Boolean(!state.get('isNew') && isNew));
};

const version = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case constants.GET_VERSION_SUCCESS:
    return setVersion(state, action);
  default:
    return state;
  }
};

const users = combineReducers({
  user,
  version,
  view
});

export default users;
