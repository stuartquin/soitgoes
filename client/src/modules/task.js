'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';
import { addFlashMessage } from 'modules/flashmessage';

const GET_TASKS_START = 'GET_TASKS_START';
const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
const UPDATE_TASK_START = 'UPDATE_TASK_START';

export const fetchTasks = (id=null, project=null, invoice=null) => (dispatch) => {
  dispatch({
    type: GET_TASKS_START
  });

  const path = id === null ? 'tasks/' : `tasks/${id}`;
  const params = {project, invoice};

  api.fetchPath(path, params).then(res => {
    dispatch({
      type: GET_TASKS_SUCCESS,
      items: res.results ? res.results : [res]
    });
  });
};

export const completeTask = (id) => (dispatch) => {
  dispatch({
    type: UPDATE_TASK_START
  });

  const updates = {
    completed_at: (new Date()).toISOString().substr(0, 19)
  };

  api.update('tasks/', id, updates).then(res => {
    dispatch({
      type: GET_TASKS_SUCCESS,
      items: [res]
    });
  });
};

export const updateTask = (id, updates) => (dispatch) => {
  dispatch({
    type: UPDATE_TASK_START
  });

  return api.update('tasks/', id, updates).then(res =>
    dispatch({
      type: GET_TASKS_SUCCESS,
      items: [res]
    })
  );
};

export const addTask = (form) => (dispatch) => {
  dispatch({
    type: UPDATE_TASK_START
  });

  return api.add('tasks/', form).then(res => {
    const text = `Added task ${res.name}`;
    const link = `/tasks/${res.id}`;
    const action = 'View';

    dispatch(addFlashMessage({ text, action, link }));
    dispatch({
      type: GET_TASKS_SUCCESS,
      items: [res]
    });
  });
};


const view = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  default:
    return state;
  }
};

const items = (state = Immutable.OrderedMap({}), action) => {
  switch(action.type) {
  case GET_TASKS_SUCCESS:
    return state.merge(getById(action.items));
  default:
    return state;
  }
};

const tasks = combineReducers({
  items,
  view
});

export default tasks;
