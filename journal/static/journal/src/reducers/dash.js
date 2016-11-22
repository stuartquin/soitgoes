'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const invoiceSummary = (state, action) => {
  if (!state) {
    return Immutable.Map({
      isSaving: false,
      isLoading: false,
      items: Immutable.Map()
    });
  }
  switch (action.type) {
  case constants.GET_SUMMARY_SUCCESS:
    const items = Immutable.fromJS(action.summary);
    return state.set('isLoading', false).set('items', items);
  default:
    return state;
  }
};

const dash = combineReducers({
  invoiceSummary
});

export default dash;
