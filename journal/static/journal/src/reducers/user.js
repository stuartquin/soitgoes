'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import constants from '../constants';

const getById = (items) => {
  let map = Immutable.OrderedMap();
  items.forEach(item => map = map.set(
    item.id,
    Immutable.fromJS(item)
  ))
  return map;
};

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

const accounts = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case constants.GET_ACCOUNTS_SUCCESS:
    return state.merge(getById(action.accounts));
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

const login = (state = Immutable.Map({error: false}), action) => {
  switch(action.type) {
  case constants.LOGIN_USER_ERROR:
    return Immutable.Map({error: true})
  default:
    return state;
  }
};

const users = combineReducers({
  user,
  accounts,
  version,
  login,
  view
});

export default users;
