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

const users = combineReducers({
  user,
  view
});

export default users;
