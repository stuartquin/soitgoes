'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const headerBar = (state=Immutable.Map(), action) => {
  switch (action.type) {
  case '@@router/LOCATION_CHANGE':
    const path = action.payload.pathname || '/';
    return Immutable.fromJS({
      path: path.substr(1).split('/').reverse()
    });
  default:
    return state;
  }
};

const nav = combineReducers({
  headerBar
});

export default nav;
