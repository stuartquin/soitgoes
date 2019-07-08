import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';
import { addFlashMessage } from 'modules/flashmessage';
import reduxHelper from 'services/reduxHelper';

const GET_TASKS_START = 'GET_TASKS_START';
const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
const UPDATE_TASK_START = 'UPDATE_TASK_START';

const NS = 'TASK';

export const fetchTasks = reduxHelper.fetch(
  NS,
  (project = null) => api.get('tasks/', {project})
);

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

export const saveTask = reduxHelper.save(
  NS,
  task => task.id ?
    api.put(`tasks/${task.id}`, task) :
    api.post('tasks/', task)
);

const items = reduxHelper.items(NS);
const results = reduxHelper.results(NS);

export default combineReducers({
  items,
  results,
});
