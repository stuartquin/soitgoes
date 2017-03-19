'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';

const GET_PROJECTS_START = 'GET_PROJECTS_START';
const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';

export const fetchProjects = () => (dispatch) =>
  api.fetchPath('projects/').then(res => {
    dispatch({
      type: GET_PROJECTS_SUCCESS,
      items: res.results
    });
  });

export const addProject = (form) => (dispatch) => {
  dispatch({
    type: GET_PROJECTS_START
  });

  api.add('projects/', form).then(res => {
    dispatch({
      type: GET_PROJECTS_SUCCESS,
      items: [res]
    });
  });
};

const view = (state = Immutable.Map(), action) => {
  switch (action.type) {
  default:
    return state;
  }
};

const items = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case GET_PROJECTS_SUCCESS:
    return state.merge(Immutable.fromJS(getById(action.items)));
  default:
    return state;
  }
};

const projects = combineReducers({
  items,
  view
});

export default projects;
