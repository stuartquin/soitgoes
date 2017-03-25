'use strict';
import Immutable from 'immutable';
import moment from 'moment';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';

export const GET_TIMESLIPS_SUCCESS = 'GET_TIMESLIPS_SUCCESS';
const GET_TIMESLIPS_START = 'GET_TIMESLIPS_START';
const UPDATE_PROJECT_TIMESLIP = 'UPDATE_PROJECT_TIMESLIP';
const ADD_PROJECT_TIMESLIP = 'ADD_PROJECT_TIMESLIP';
const SAVE_TIMESLIPS_START = 'SAVE_TIMESLIPS_START';
const SAVE_TIMESLIPS_SUCCESS = 'SAVE_TIMESLIPS_SUCCESS';
const SET_TIMESLIP_ACTIVE_DATE = 'SET_TIMESLIP_ACTIVE_DATE';

export const saveTimeslips = (existingTimeslips, newTimeslips) => {
  const updates = existingTimeslips.filter((t) =>
    t.get('isUpdated')
  );
  let calls = [api.updateTimeslips(updates)];

  if (newTimeslips.size) {
    calls = calls.concat(api.createTimeslips(newTimeslips));
  }

  return (dispatch) => {
    dispatch({ type: SAVE_TIMESLIPS_START });

    return Promise.all(calls).then(
      ([updates, created=[]]) => {
        return dispatch({
          type: SAVE_TIMESLIPS_SUCCESS,
          items: updates.concat(created)
        });
      },
      error => console.error(error) // eslint-disable-line
    );
  };
};

export const hourChanged = (project, date, hours, user, timeslip) => {
  let action = {
    project,
    hours,
    date,
    user,
    timeslip
  };

  if (timeslip && timeslip.get('id')) {
    action.type = UPDATE_PROJECT_TIMESLIP;
  } else {
    action.type = ADD_PROJECT_TIMESLIP;
  }
  return action;
};

export const fetchTimeslips = (invoice, start, end) => (dispatch) => {
  const startDate = start.format('YYYY-MM-DD');
  const endDate = end.format('YYYY-MM-DD');

  return api.fetchTimeslips(invoice, startDate, endDate).then(res => {
    dispatch({
      type: GET_TIMESLIPS_SUCCESS,
      items: res.results
    });
  });
};

export const setActiveDate = (start, end) => (dispatch) => {
  dispatch({
    type: GET_TIMESLIPS_START
  });
  dispatch({
    type: SET_TIMESLIP_ACTIVE_DATE,
    date: start
  });

  return dispatch(fetchTimeslips(null, start, end));
};

const updateProjectTimeslip = (state, action) => {
  const timeslip = action.timeslip;
  return state.mergeIn([timeslip.get('id')], {
    hours: action.hours,
    isUpdated: true
  });
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

const items = (state = Immutable.OrderedMap(), action) => {
  switch(action.type) {
  case SAVE_TIMESLIPS_SUCCESS:
    return state.merge(getById(action.items));
  case GET_TIMESLIPS_SUCCESS:
    return state.merge(getById(action.items));
  case UPDATE_PROJECT_TIMESLIP:
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
  case ADD_PROJECT_TIMESLIP:
    return addProjectTimeslip(state, action);
  case SET_TIMESLIP_ACTIVE_DATE:
    return state.set('weekStart', action.date);
  case SAVE_TIMESLIPS_START:
    return state.set('isSaving', true);
  case SAVE_TIMESLIPS_SUCCESS:
    return state.set('toAdd', Immutable.Map()).set('isLoading', false).set('isSaving', false);
  case GET_TIMESLIPS_START:
    return state.set('isLoading', true);
  case GET_TIMESLIPS_SUCCESS:
    return state.set('isLoading', false).set('isSaving', false);
  default:
    return state;
  }
};

const timeslips = combineReducers({
  items,
  view
});

export default timeslips;
