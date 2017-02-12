'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const setHeaderBar = (title, crumbs=[]) => {
  const headerBar = {
    title,
    crumbs
  };
  return {
    type: constants.SET_HEADER_BAR_SUCCESS,
    headerBar
  };
};

export const setIsLoaded = (loaded=true) => {
  return {
    type: constants.SET_APP_LOAD_SUCCESS,
    loaded
  };
};
