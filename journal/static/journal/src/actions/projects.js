'use strict';
import { normalize } from 'normalizr';

import * as api from '../services/api';
import * as schema from '../actions/schema';
import constants from '../constants';

export const fetchProjects = () => (dispatch) =>
  api.fetchProjects().then(res => {
    const projects = res.results;
    const result = normalize(projects, schema.projects);
    dispatch({
      type: constants.GET_PROJECTS_SUCCESS,
      projects: result.entities.projects
    });
  });


