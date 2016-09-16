'use strict';
import Immutable from 'immutable';
import moment from 'moment';
import { combineReducers } from 'redux';

import constants from '../constants';

const updateProjectTimeslip = (state, action) => {
  const project = action.project;
  const date = action.date;
  const index = state.findIndex((t) => {
    return t.get('project') === project.get('id') && t.get('date') === date;
  });

  let updated;
  if (index === -1) {
    updated = state.push(Immutable.Map({
      project: action.project.get('id'),
      hours: action.hours,
      date: action.date,
      isNew: true,
      user: 1 // @TODO this should be the real user
    }));
  } else {
    updated = state.update(index, (timeslip) => {
      return timeslip.set('hours', action.hours).set('isUpdated', true);
    });
  }
  return updated;
};

const setActiveDate = (state, action) => {
  return state.set('activeDate', action.date);
};

const items = (state = Immutable.List([]), action) => {
  switch(action.type) {
  case constants.GET_TIMESLIPS_SUCCESS:
    return Immutable.fromJS(action.timeslips).toList();

  case constants.UPDATE_PROJECT_TIMESLIPS:
    return updateProjectTimeslip(state, action);

  default:
    return state;
  }
};

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({
      activeDate: moment().startOf('isoweek')
    });
  }

  switch (action.type) {
  case constants.SET_TIMESLIP_ACTIVE_DATE:
    return setActiveDate(state, action.date);
  default:
    return state;
  }
};

const timeslips = combineReducers({
  items,
  view
});

export default timeslips;
