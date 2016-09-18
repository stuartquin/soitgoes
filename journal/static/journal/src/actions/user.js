'use strict';
import constants from '../constants';
import * as api from '../services/api';

const VERSION_INTERVAL = 60 * 1000;

export const fetchUser = () => (dispatch) => {
  dispatch({
    type: constants.GET_USER_START
  });

  return api.fetchUser().then(user => {
    dispatch({
      type: constants.GET_USER_SUCCESS,
      user
    });
  });
};


const _fetchVersion = (dispatch) => {
  api.fetchVersion().then(version => {
    dispatch({
      type: constants.GET_VERSION_SUCCESS,
      version
    });
  });
};

// TODO probably doesn't belong here...
export const fetchVersion = () => (dispatch) => {
  _fetchVersion(dispatch);
  setInterval(() => {
    _fetchVersion(dispatch);
  }, VERSION_INTERVAL);
};
