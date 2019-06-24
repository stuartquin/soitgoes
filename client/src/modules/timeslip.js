'use strict';
import Immutable from 'immutable';
import moment from 'moment';
import { combineReducers } from 'redux';

import * as api from 'services/api';
import { fetchProjects } from 'modules/project';
import reduxHelper from 'services/reduxHelper';

const NS = 'TIMESLIP';

export const GET_TIMESLIPS_SUCCESS = 'GET_TIMESLIPS_SUCCESS';

export const saveTimeslips = (timeslips) => {
  const newTimeslips = timeslips.filter(t => !t.id);
  const updated = timeslips.filter(t => Boolean(t.id));
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
    dispatch({
      type: reduxHelper.constant(NS, 'SAVE', 'start')
    });

    return Promise.all(calls).then(([updatesRes, created=[]]) => {
      dispatch(fetchProjects());

      return dispatch({
        type: reduxHelper.constant(NS, 'SAVE', 'success'),
        items: updatesRes.concat(created)
      });
    });
  };
};

export const fetchTimeslips = reduxHelper.fetch(
  NS,
  (invoice, start = null, end = null, project = null) => (
    api.get('timeslips/', {invoice, start, end, project})
  )
);

export const updateTimeslip = (id, form) => (dispatch) =>
  api.update('timeslips/', id, form).then(res =>
    dispatch({
      type: reduxHelper.constant(NS, 'FETCH', 'success'),
      items: [res]
    })
  );

const addProjectTimeslip = (action) => {
  const task = action.task;
  const key = `${task.id}|${action.date}`;

  return {
    [key]: {
      task: action.task.id,
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
