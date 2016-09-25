'use strict';
import * as api from '../services/api';
import constants from '../constants';

const fetchTimeslipsByIds = (ids) => (dispatch) => {
  return api.fetchByIds('timeslips', ids).then(res => {
    dispatch({
      type: constants.GET_TIMESLIPS_SUCCESS,
      timeslips: res.results
    });
  });
};

export const fetchActivityFeed = () => (dispatch) =>
  api.fetchActivityFeed().then(res => {
    const feed = res.results;
    let promises = [];
    const timeslipIds = feed.filter((f) => f.type === 'TIM').map(f => f.item_id);
    promises.push(dispatch(fetchTimeslipsByIds(timeslipIds)));

    return Promise.all(promises).then(() => {
      dispatch({
        type: constants.GET_ACTIVITY_FEED_SUCCESS,
        feed: feed
      });
    });
  });


