'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const getInvoicesById = (items) => {
  let invoices = Immutable.OrderedMap();
  items.forEach((item) => {
    invoices = invoices.set(item.id, item);
  });
  return invoices;
};

const items = (state = Immutable.OrderedMap(), action) => {
  switch (action.type) {
  case constants.GET_INVOICES_SUCCESS:
    return getInvoicesById(action.invoices);
  default:
    return state;
  }
};

const invoices = combineReducers({
  items
});

export default invoices;
