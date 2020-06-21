'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import constants from '../constants';

const items = (state = Immutable.List(), action) => {
  switch (action.type) {
    case constants.GET_ACTIVITY_FEED_SUCCESS:
      return Immutable.fromJS(action.feed);

    default:
      return state;
  }
};

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({});
  }

  switch (action.type) {
    default:
      return state;
  }
};

const activityFeed = combineReducers({
  items,
  view,
});

export default activityFeed;
