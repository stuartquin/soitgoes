'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import constants from '../constants';

const getById = (items) => {
  return items.reduce((prev, current) => {
    prev[current.id] = current;
    return prev;
  }, {});
};

const view = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  default:
    return state;
  }
};

const items = (state = Immutable.Map({}), action) => {
  switch(action.type) {
  case constants.GET_TASKS_SUCCESS:
    return state.merge(Immutable.fromJS(getById(action.tasks)));
  default:
    return state;
  }
};

const tasks = combineReducers({
  items,
  view
});

export default tasks;
