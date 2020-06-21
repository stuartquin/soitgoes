'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const getById = (items) => {
  let map = Immutable.OrderedMap();
  items.forEach((item) => {
    map = map.set(item.id, item);
  });
  return map;
};

const summary = (state, action) => {
  if (!state) {
    return Immutable.Map({
      isSaving: false,
      isLoading: false,
      expenses: Immutable.Map(),
      invoices: Immutable.Map(),
    });
  }
  switch (action.type) {
    case constants.GET_SUMMARY_SUCCESS:
      const items = Immutable.fromJS(action.summary);
      return state.set('isLoading', false).set(action.summaryType, items);
    default:
      return state;
  }
};

const dash = combineReducers({
  summary,
});

export default dash;
