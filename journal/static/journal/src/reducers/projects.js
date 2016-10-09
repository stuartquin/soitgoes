'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import constants from '../constants';

const getProjectsById = (items) => {
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
  case constants.GET_PROJECTS_SUCCESS:
    return state.merge(Immutable.fromJS(getProjectsById(action.projects)));
  default:
    return state;
  }
};

const projects = combineReducers({
  items,
  view
});

export default projects;
