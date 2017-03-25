'use strict';
import * as api from '../services/api';
import constants from '../constants';

import { GET_TIMESLIPS_SUCCESS } from 'modules/timeslip';

const fetchTimeslipsByIds = (ids) => (dispatch) => {
  return api.fetchByIds('timeslips', ids).then(res => {
    dispatch({
      type: GET_TIMESLIPS_SUCCESS,
      timeslips: res.results
    });
  });
};

const fetchInvoicesByIds = (ids) => (dispatch) => {
  return api.fetchByIds('invoices', ids).then(res => {
    dispatch({
      type: constants.GET_INVOICES_SUCCESS,
      invoices: res.results
    });
  });
};

export const fetchActivityFeed = () => (dispatch) =>
  api.fetchActivityFeed().then(res => {
    const feed = res.results;
    let promises = [];
    const timeslipIds = feed.filter((f) => f.type === 'TIM').map(f => f.item_id);
    const invoiceIds = feed.filter((f) => f.type === 'INV').map(f => f.item_id);

    promises.push(dispatch(fetchTimeslipsByIds(timeslipIds)));
    promises.push(dispatch(fetchInvoicesByIds(invoiceIds)));

    return Promise.all(promises).then(() => {
      dispatch({
        type: constants.GET_ACTIVITY_FEED_SUCCESS,
        feed: feed
      });
    });
  });


