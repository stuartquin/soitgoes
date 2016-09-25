'use strict';
import Immutable from 'immutable';
import moment from 'moment';
import { combineReducers } from 'redux';

import constants from '../constants';

const updateProjectTimeslip = (state, action) => {
  const timeslip = action.timeslip;
  return state.set(timeslip.get('id'), timeslip.merge({
    hours: action.hours,
    isUpdated: true
  }));
};

const addProjectTimeslip = (state, action) => {
  const project = action.project;
  const key = `${project.get('id')}|${action.date}`;

  return state.setIn(['toAdd', key], Immutable.Map({
    project: action.project.get('id'),
    hours: action.hours,
    date: action.date,
    isNew: true,
    user: action.user.get('id')
  }));
};

const setActiveDate = (state, action) => {
  return state.set('weekStart', action.date);
};

const items = (state = Immutable.Map(), action) => {
  switch(action.type) {
  case constants.GET_TIMESLIPS_SUCCESS:
    return state.merge(Immutable.fromJS(action.timeslips));

  case constants.UPDATE_PROJECT_TIMESLIP:
    return updateProjectTimeslip(state, action);

  default:
    return state;
  }
};

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({
      weekStart: moment().startOf('isoweek'),
      isSaving: false,
      isLoading: false,
      toAdd: Immutable.Map()
    });
  }

  switch (action.type) {
  case constants.ADD_PROJECT_TIMESLIP:
    return addProjectTimeslip(state, action);
  case constants.SET_TIMESLIP_ACTIVE_DATE:
    return setActiveDate(state, action);
  case constants.SAVE_TIMESLIPS_START:
    return state.set('isSaving', true);
  case constants.SAVE_TIMESLIPS_SUCCESS:
    return state.set('isSaving', false);
  case constants.GET_TIMESLIPS_START:
    return state.set('isLoading', true);
  case constants.GET_TIMESLIPS_SUCCESS:
    return state.set('isLoading', false);
  default:
    return state;
  }
};

const timeslips = combineReducers({
  items,
  view
});

export default timeslips;
