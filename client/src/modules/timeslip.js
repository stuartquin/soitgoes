'use strict';
import Immutable from 'immutable';
import moment from 'moment';
import { combineReducers } from 'redux';

import keyById from 'services/keyById';
import * as api from 'services/api';
import { fetchProjects } from 'modules/project';
import reduxHelper from 'services/reduxHelper';

const NS = 'TIMESLIP';

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

export const fetchTimeslips = reduxHelper.fetch(
  NS,
  (invoice, start = null, end = null) => (
    api.fetchPath('timeslips/', {invoice, start, end})
  )
);

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

const items = reduxHelper.items(NS);
const results = reduxHelper.results(NS);

const timeslip = combineReducers({
  items,
  results,
});

export default timeslip;
