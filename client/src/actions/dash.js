'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const fetchSummary = (summaryType, start, end) => (dispatch) => {
  dispatch({
    type: constants.GET_SUMMARY_START
  });

  return api.fetchSummary(summaryType, start, end).then((res) =>
    dispatch({
      summaryType,
      type: constants.GET_SUMMARY_SUCCESS,
      summary: res
    })
  );
};

export const fetchExpenses = (start, end) => (dispatch) => {
  dispatch({
    type: constants.GET_EXPENSES_START
  });

  return api.fetchExpenses(start, end).then((res) =>
    dispatch({
      type: constants.GET_EXPENSES_SUCCESS,
      expenses: res
    })
  );
};
