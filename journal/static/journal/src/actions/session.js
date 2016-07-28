'use strict';
import { push } from 'react-router-redux';

import * as api from '../services/api';
import constants from '../constants';

export const setUserAuth = (username, password) => {
  const auth = btoa(`${username}:${password}`);
  document.cookie = `soitgoes_auth=${auth}`;
};

export const createSession = (username, password) => (dispatch) => {
  setUserAuth(username, password);
  api.createSession(username, password).then(user => {
    dispatch({
      type: constants.CREATE_SESSION_SUCCESS,
      user
    });
    dispatch(push(`/timeslips`));
  });
};
