'use strict';
import constants from '../constants';
import * as api from '../services/api';

const saveTimeslipsSuccess = () => {
  return {
    type: constants.SAVE_TIMESLIPS_SUCCESS
  };
};

const savingTimeslips = () => {
  return {
    type: constants.SAVE_TIMESLIPS_START
  };
};

export const saveTimeslips = (projects, timeslips) => {
  const updates = timeslips.filter(t => t.get('isUpdated') && !t.get('isNew'));
  const creates = timeslips.filter(t => t.get('isNew'));
  let calls = [api.updateTmeslips(updates)];

  if (creates.size) {
    calls = calls.concat(api.createTimeslips(creates));
  }

  return (dispatch) => {
    dispatch(savingTimeslips());

    return Promise.all(calls).then(
      () => dispatch(saveTimeslipsSuccess()),
      error => console.error(error) // eslint-disable-line
    );
  };
};

export const updateTimeslipValue = (project, date, hours, userId) => ({
  type: constants.UPDATE_PROJECT_TIMESLIPS,
  project,
  hours,
  date,
  userId
});

export const fetchTimeslips = (invoice, start, end) => (dispatch) => {
  const startDate = start.format('YYYY-MM-DD');
  const endDate = end.format('YYYY-MM-DD');

  return api.fetchTimeslips(invoice, startDate, endDate).then(res => {
    dispatch({
      type: constants.GET_TIMESLIPS_SUCCESS,
      timeslips: res.results
    });
  });
};

export const setActiveDate = (start, end) => (dispatch) => {
  dispatch({
    type: constants.GET_TIMESLIPS_START
  });
  dispatch({
    type: constants.SET_TIMESLIP_ACTIVE_DATE,
    date: start
  });

  return dispatch(fetchTimeslips(null, start, end));
};
