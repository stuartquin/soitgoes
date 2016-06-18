'use strict';
import { normalize } from 'normalizr';

import constants from '../constants';
import * as api from '../services/api';
import * as schema from '../actions/schema';

export const setActiveDate = (date) => {
  return {
    type: constants.SET_TIMESLIP_ACTIVE_DATE,
    date
  };
};

const saveTimeslipsSuccess = () => {
  return {
    type: constants.SAVE_TIMESLIPS_SUCCESS
  };
};

export const saveTimeslips = (projects, timeslips) => {
  const updates = timeslips.filter(t => t.get('isUpdated') && !t.get('isNew'));
  const creates = timeslips.filter(t => t.get('isNew'));
  let calls = api.updateTmeslips(updates);

  if (creates.size) {
    calls = calls.concat(api.createTimeslips(creates));
  }

  return (dispatch) => {
    return Promise.all(calls).then(
      result => dispatch(saveTimeslipsSuccess()),
      error => dispatch(saveTimeslipsError(error))
    );
  };
};

export const updateTimeslipValue = (project, date, hours) => ({
  type: constants.UPDATE_PROJECT_TIMESLIPS,
  project,
  hours,
  date
});

export const fetchTimeslips = () => (dispatch) =>
  api.fetchTimeslips().then(timeslips => {
    const result = normalize(timeslips, schema.timeslips);
    dispatch({
      type: constants.GET_TIMESLIPS_SUCCESS,
      timeslips: result.entities.timeslips
    });
    dispatch({
      type: constants.GET_PROJECTS_SUCCESS,
      projects: result.entities.projects
    });
  });
