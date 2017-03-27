'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import * as api from 'services/api';
import { push } from 'react-router-redux';

const SET_APP_LOAD_SUCCESS = 'SET_APP_LOAD_SUCCESS';

export const setIsLoaded = (loaded=true) => {
  return {
    type: SET_APP_LOAD_SUCCESS,
    loaded
  };
};

export const navigate = (path) => (dispatch) => {
  dispatch(push(path));
};

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
  case SET_APP_LOAD_SUCCESS:
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
