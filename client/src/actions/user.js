import constants from '../constants';
import * as api from '../services/api';

const VERSION_INTERVAL = 30 * 1000;

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

export const fetchAccounts = () => (dispatch) => {
  dispatch({
    type: constants.GET_ACCOUNTS_START
  });

  return api.fetchAccounts().then(res => {
    const accounts = res.results;
    dispatch({
      type: constants.GET_ACCOUNTS_SUCCESS,
      accounts
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

export const login = (form) => (dispatch) => {
  return api.login(form).then(res => {
    if (res.ok) {
      location.href = '/';
    } else {
      dispatch({
        type: constants.LOGIN_USER_ERROR
      });
    }
  });
};

export const logout = (form) => (dispatch) => {
  return api.logout().then(res => {
    location.href = '/';
  });
};
