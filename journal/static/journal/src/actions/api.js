'use strict';
import constants from '../constants';

const baseUrl = 'http://localhost:8000/api/';

const getOptions = (method) => {
  return {
      method: 'get',
      headers: {
        Authorization: 'Basic '+btoa('stuart:topsecret'),
        'Content-Type': 'application/json'
      }
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

export const getTimeslips = (projectId) => {
    const url = baseUrl + `projects/${projectId}/timeslips?format=json`;
    return (dispatch) => {
        return fetch(url, getOptions('get')).then(
            res => {
                return res.json().then(json => {
                    return dispatch(getTimeslipsSuccess(json, dispatch));
                });
            },
            error => dispatch(getTimeslipsError(error, dispatch))
        );
    };
};

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

export const getProjects = () => {
    const url = baseUrl + `projects/`;
    return (dispatch) => {
        return fetch(url, getOptions('get')).then(
            res => {
                return res.json().then(json => {
                    return dispatch(getProjectsSuccess(json, dispatch));
                });
            },
            error => dispatch(getProjectsError(error, dispatch))
        );
    };
};
