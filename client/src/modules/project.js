'use strict';
import { combineReducers } from 'redux';

import * as api from 'services/api';
import {addFlashMessage} from 'modules/flashmessage';

const GET_PROJECTS_START = 'GET_PROJECTS_START';
const GET_PROJECTS_SUCCESS = 'GET_PROJECTS_SUCCESS';

const getById = (items) => {
  console.log('Items', items);
  return items.reduce((agg, item) => ({
    ...agg,
    [item.id]: item,
  }), {});
};

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


const items = (state = {}, action) => {
  switch(action.type) {
  case GET_PROJECTS_SUCCESS:
    return {
      ...state,
      ...getById(action.items)
    };
  default:
    return state;
  }
};

const projects = combineReducers({
  items,
});

export default projects;
