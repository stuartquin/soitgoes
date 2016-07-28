'use strict';
import Immutable from 'immutable';

import constants from '../constants';

const setUser = (state, user) => {
  debugger;
};

export default function(state, action) {
  switch(action.type) {
  case constants.CREATE_SESSION_SUCCESS:
    return setUser(state, action.user);
  default:
    return state || Immutable.Map({});
  }
}
