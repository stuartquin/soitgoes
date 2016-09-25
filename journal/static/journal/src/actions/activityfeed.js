'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const fetchActivityFeed = () => (dispatch) =>
  api.fetchActivityFeed().then(res => {
    const feed = res.results;
    dispatch({
      type: constants.GET_ACTIVITY_FEED_SUCCESS,
      feed: feed
    });
  });


