'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const fetchProjects = () => (dispatch) =>
  api.fetchProjects().then(res => {
    const projects = res.results;
    dispatch({
      type: constants.GET_PROJECTS_SUCCESS,
      projects: projects
    });
  });


