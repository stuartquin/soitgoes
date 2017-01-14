'use strict';
import { push } from 'react-router-redux';

import * as api from '../services/api';
import constants from '../constants';

export const fetchTasks = () => (dispatch) => {
  dispatch({
    type: constants.GET_TASKS_START
  });
  api.fetchTasks().then(res => {
    const tasks = res.results;
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks
    });
  });
};
