'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const fetchSummary = (type, start, end) => (dispatch) => {
  dispatch({
    type: constants.GET_SUMMARY_START
  });

  return api.fetchSummary(type, start, end).then((res) =>
    dispatch({
      type: constants.GET_SUMMARY_SUCCESS,
      summary: res
    })
  );
};
