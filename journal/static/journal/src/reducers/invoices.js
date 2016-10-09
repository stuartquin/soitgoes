'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const getInvoicesById = (items) => {
  return items.reduce((prev, current) => {
    prev[current.id] = current;
    return prev;
  }, {});
};

const items = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case constants.GET_INVOICES_SUCCESS:
    return Immutable.Map(getInvoicesById(action.invoices));
  default:
    return state;
  }
};

const invoices = combineReducers({
  items
});

export default invoices;
