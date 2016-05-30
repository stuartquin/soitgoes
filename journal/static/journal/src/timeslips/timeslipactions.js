'use strict';
import constants from '../constants';
import { getOptions } from '../services/api';

const baseUrl = 'http://localhost:8000/api/';

const getProjectsSuccess = (res, dispatch) => {
    return {
        type: constants.GET_PROJECTS_SUCCESS,
        projects: res.results
    };
};

const getProjectsError = (error, dispatch) => {
    return {
        type: constants.GET_PROJECTS_ERROR,
        error
    };
};

export const setActiveDate = (date) => {
  return {
    type: constants.SET_TIMESLIP_ACTIVE_DATE,
    date
  };
};

export const getProjects = (auth) => {
  const url = baseUrl + `projects/`;
  return (dispatch) => {
    return fetch(url, getOptions(auth, 'GET')).then(
      res => {
        return res.json().then(json => {
          return dispatch(getProjectsSuccess(json, dispatch));
        });
      },
      error => dispatch(getProjectsError(error, dispatch))
    );
  };
};

const saveTimeslipsSuccess = (res) => {
    return {
        type: constants.SAVE_TIMESLIPS_SUCCESS,
        projects: res.results
    };
};

export const saveTimeslips = (auth, projects, timeslips) => {
  const url = baseUrl + `timeslips/`;
  let options = getOptions(auth, 'POST');
  options.body = JSON.stringify(timeslips.filter(t => t.get('isNew')).toJS());

  return (dispatch) => {
    return fetch(url, options).then(res => {
        return res.json().then(json => {
          return dispatch(saveTimeslipsSuccess(json));
        });
      },
      error => dispatch(saveTimeslipsError(error))
    );
  };
};

const getTimeslipsSuccess = (timeslips, dispatch) => {
  return {
    type: constants.GET_TIMESLIPS_SUCCESS,
    timeslips
  };
};

const getTimeslipsError = (error, dispatch) => {
    return {
        type: constants.GET_TIMESLIPS_ERROR,
        error
    };
};

export const getTimeslips = (auth) => {
  const url = baseUrl + `timeslips/?format=json`;
  return (dispatch) => {
    return fetch(url, getOptions(auth, 'GET')).then(
      res => {
        return res.json().then(json => {
          return dispatch(getTimeslipsSuccess(json, dispatch));
        });
      },
      error => dispatch(getTimeslipsError(error, dispatch))
    );
  };
};

