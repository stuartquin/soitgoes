'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const fetchProjects = () => (dispatch) =>
  api.fetchProjects().then(res => {
    dispatch({
      type: constants.GET_PROJECTS_SUCCESS,
      items: res.results
    });
  });

export const addProject = (form) => (dispatch) => {
  dispatch({
    type: constants.UPDATE_PROJECT_START
  });

  api.addProject(form).then(res => {
    dispatch({
      type: constants.GET_PROJECTS_SUCCESS,
      items: [res]
    });
  });
};
