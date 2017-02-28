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

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({
      isLoading: true
    });
  }
  switch (action.type) {
  case constants.SET_APP_LOAD_START:
  case constants.GET_INVOICES_START:
    return state.merge({isLoading: true});
  case constants.SAVE_INVOICE_SUCCESS:
  case constants.GET_INVOICES_SUCCESS:
  case constants.GET_INVOICE_SUCCESS:
    return state.merge({isLoading: false});
  default:
    return state;
  }
};

const invoices = combineReducers({
  items,
  view
});


export default invoices;
