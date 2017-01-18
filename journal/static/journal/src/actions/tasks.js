'use strict';
import { push } from 'react-router-redux';

import * as api from '../services/api';
import constants from '../constants';

export const fetchTasks = (id=null) => (dispatch) => {
  dispatch({
    type: constants.GET_TASKS_START
  });
  api.fetchTasks(id).then(res => {
    let tasks = [];
    if (res.results) {
      tasks = res.results;
    } else {
      tasks = [res];
    }
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks
    });
  });
};

export const completeTask = (id) => (dispatch) => {
  dispatch({
    type: constants.UPDATE_TASK_START
  });

  const updates = {
    completed_at: (new Date()).toISOString().substr(0, 19)
  };

  api.updateTask(id, updates).then(res => {
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks: [res]
    });
  });
};

export const updateTask = (id, updates) => (dispatch) => {
  dispatch({
    type: constants.UPDATE_TASK_START
  });

  api.updateTask(id, updates).then(res => {
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks: [res]
    });
  });
};
