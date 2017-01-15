'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import constants from '../constants';

const getById = (items) => {
  let map = Immutable.OrderedMap();
  items.forEach(item => map = map.set(
    item.id,
    Immutable.fromJS(item)
  ))
  return map;
};

const view = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  default:
    return state;
  }
};

const items = (state = Immutable.OrderedMap({}), action) => {
  switch(action.type) {
  case constants.GET_TASKS_SUCCESS:
    return state.merge(getById(action.tasks));
  default:
    return state;
  }
};

const tasks = combineReducers({
  items,
  view
});

export default tasks;
