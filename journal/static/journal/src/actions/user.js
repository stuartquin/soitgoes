'use strict';
import constants from '../constants';

const getCookies = () => {
  return document.cookie.split("; ").reduce((result, item) => {
    var bits = item.split("=");
    result[bits[0]] = bits.slice(1).join("=");
    return result;
  }, {});
};

export const getUserAuth = () => {
  const cookies = getCookies();

  if (cookies.soitgoes_auth) {
    return {
      type: constants.GET_USER_AUTH_SUCCESS,
      auth: cookies.soitgoes_auth
    };
  } else {
    return {
      type: constants.GET_USER_AUTH_ERROR
    };
  }
};

export const setUserAuth = (fields) => {
  const auth = btoa(`${fields.username}:${fields.password}`);
  document.cookie = `soitgoes_auth=${auth}`;

  return {
    type: constants.SET_USER_AUTH_SUCCESS,
    auth: auth
  };
};
