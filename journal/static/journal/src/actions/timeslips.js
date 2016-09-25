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

export const saveTimeslips = (existingTimeslips, newTimeslips) => {
  const updates = existingTimeslips.filter(t => t.get('isUpdated'));
  let calls = [api.updateTmeslips(updates)];

  if (newTimeslips.size) {
    calls = calls.concat(api.createTimeslips(newTimeslips));
  }

  return (dispatch) => {
    dispatch(savingTimeslips());

    return Promise.all(calls).then(
      () => dispatch(saveTimeslipsSuccess()),
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
  if (timeslip) {
    action.type = constants.UPDATE_PROJECT_TIMESLIP;
  } else {
    action.type = constants.ADD_PROJECT_TIMESLIP;
  }
  return action;
};

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
