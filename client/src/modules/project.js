'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';
import {addFlashMessage} from 'modules/flashmessage';

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

  return api.add('projects/', form).then(res => {
    const text = `Added project ${res.name}`;
    const link = `/projects/${res.id}`;
    const action = 'View';

    dispatch(addFlashMessage({ text, action, link }));
    dispatch({
      type: GET_PROJECTS_SUCCESS,
      items: [res]
    });
  });
};

export const updateProject = (id, form) => (dispatch) => {
  return api.update('projects/', id, form).then(res => {
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
