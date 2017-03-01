'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';


const headerBar = (state=Immutable.Map(), action) => {
  switch (action.type) {
  case '@@router/LOCATION_CHANGE':
    const path = action.payload.pathname || '/';
    return Immutable.fromJS({
      path: path.substr(1).split('/')
    });
  default:
    return state;
  }
};

const view = (state=Immutable.Map(), action) => {
  switch (action.type) {
  case constants.SET_APP_LOAD_SUCCESS:
    return Immutable.fromJS({
      isLoaded: action.loaded
    });
  default:
    return state;
  }

}

const nav = combineReducers({
  headerBar,
  view
});

export default nav;
