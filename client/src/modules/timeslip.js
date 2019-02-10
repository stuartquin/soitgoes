'use strict';
import Immutable from 'immutable';
import moment from 'moment';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import keyById from 'services/keyById';
import * as api from 'services/api';
import { fetchProjects } from 'modules/project';

export const GET_TIMESLIPS_SUCCESS = 'GET_TIMESLIPS_SUCCESS';
const GET_TIMESLIPS_START = 'GET_TIMESLIPS_START';
const UPDATE_PROJECT_TIMESLIP = 'UPDATE_PROJECT_TIMESLIP';
const ADD_PROJECT_TIMESLIP = 'ADD_PROJECT_TIMESLIP';
const SAVE_TIMESLIPS_START = 'SAVE_TIMESLIPS_START';
const SAVE_TIMESLIPS_SUCCESS = 'SAVE_TIMESLIPS_SUCCESS';
const SET_TIMESLIP_ACTIVE_DATE = 'SET_TIMESLIP_ACTIVE_DATE';

export const saveTimeslips = (timeslips) => {
  const newTimeslips = timeslips.filter(t => t.isNew);
  const updated = timeslips.filter(t => t.isUpdated);
  const updates = Promise.all(updated.map((timeslip) =>
    api.update('timeslips/', timeslip.id, {
      hours: timeslip.hours,
    })
  ));
  let calls = [updates];

  if (newTimeslips.length) {
    calls = calls.concat(api.add('timeslips/', newTimeslips));
  }

  return (dispatch) => {
    dispatch({ type: SAVE_TIMESLIPS_START });

    return Promise.all(calls).then(([updatesRes, created=[]]) => {
      dispatch(fetchProjects());

      return dispatch({
        type: SAVE_TIMESLIPS_SUCCESS,
        items: updatesRes.concat(created)
      });
    });
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

  if (timeslip && timeslip.id) {
    action.type = UPDATE_PROJECT_TIMESLIP;
  } else {
    action.type = ADD_PROJECT_TIMESLIP;
  }
  return action;
};

export const fetchTimeslips = (invoice, startDate, endDate) => (dispatch) => {
  const start = startDate ? startDate.format('YYYY-MM-DD') : null;
  const end = endDate ? endDate.format('YYYY-MM-DD') : null;

  return api.fetchPath('timeslips/', {invoice, start, end}).then(res => {
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

export const updateTimeslip = (id, form) => (dispatch) =>
  api.update('timeslips/', id, form).then(res =>
    dispatch({
      type: GET_TIMESLIPS_SUCCESS,
      items: [res]
    })
  );

const addProjectTimeslip = (action) => {
  const project = action.project;
  const key = `${project.id}|${action.date}`;

  return {
    [key]: {
      project: action.project.id,
      hours: action.hours,
      date: action.date,
      isNew: true,
      user: action.user.get('id')
    }
  };
};

const items = (state = {}, action) => {
  switch(action.type) {
  case SAVE_TIMESLIPS_SUCCESS:
  case GET_TIMESLIPS_SUCCESS:
    return {
      ...state,
      ...keyById(action.items),
    };
  case ADD_PROJECT_TIMESLIP:
    return {
      ...state,
      ...addProjectTimeslip(action),
    };
  case UPDATE_PROJECT_TIMESLIP:
    return {
      ...state,
      [action.timeslip.id]: {
        ...state[action.timeslip.id],
        hours: action.hours,
        isUpdated: true,
      }
    };
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
    });
  }

  switch (action.type) {
  case SET_TIMESLIP_ACTIVE_DATE:
    return state.set('weekStart', action.date);
  case SAVE_TIMESLIPS_START:
    return state.set('isSaving', true);
  case SAVE_TIMESLIPS_SUCCESS:
    return state.set('isLoading', false).set('isSaving', false);
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
