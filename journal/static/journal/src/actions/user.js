'use strict';
import constants from '../constants';
import * as api from '../services/api';


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
