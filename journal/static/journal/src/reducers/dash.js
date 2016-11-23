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

const expenses = (state, action) => {
  if (!state) {
    return Immutable.OrderedMap();
  }

  switch (action.type) {
  case constants.GET_EXPENSES_SUCCESS:
    return getById(action.expenses.results);
  default:
    return state;
  }
};

const dash = combineReducers({
  invoiceSummary,
  expenses
});

export default dash;
