'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const getById = (items) => {
  let map = Immutable.OrderedMap();
  items.forEach(item => map = map.set(
    item.id,
    Immutable.fromJS(item)
  ))
  return map;
};

const items = (state = Immutable.OrderedMap(), action) => {
  switch (action.type) {
  case constants.DELETE_INVOICE_SUCCESS:
    return state.delete(action.invoiceId);
  case constants.SAVE_INVOICE_SUCCESS:
    return state.merge(getById([action.invoice]));
  case constants.GET_INVOICES_SUCCESS:
    return state.merge(getById(action.invoices));
  case constants.GET_INVOICE_SUCCESS:
    return state.merge(getById([action.invoice]));
  default:
    return state;
  }
};

const invoices = combineReducers({
  items
});

export default invoices;
