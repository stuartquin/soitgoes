'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';


const details = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  case constants.GET_INVOICE_SUCCESS:
  case constants.CREATE_INVOICE_SUCCESS:
  case constants.SAVE_INVOICE_SUCCESS:
    return Immutable.fromJS(action.invoice);
  case constants.DELETE_INVOICE_SUCCESS:
    return Immutable.Map({});
  default:
    return state;
  }
};

const setInvoiceTimeslips = (state, action) => {
  return state.concat(Immutable.fromJS(action.timeslips || []));
};

const timeslips = (state = Immutable.List([]), action) => {
  switch (action.type) {
  case constants.GET_INVOICE_TIMESLIPS_SUCCESS:
    return setInvoiceTimeslips(state, action);
  case constants.CLEAR_INVOICE_TIMESLIPS:
    return Immutable.List([]);
  default:
    return state;
  }
};

const setInvoiceItems = (state, action) => {
  return state.concat(Immutable.fromJS(action.items || []));
};

const additionalItems = (state = Immutable.List([]), action) => {
  switch (action.type) {
  case constants.GET_INVOICE_ITEMS_SUCCESS:
    return Immutable.fromJS(action.items || []);
  case constants.CREATE_INVOICE_ITEM_SUCCESS:
    return setInvoiceItems(state, [action.item]);
  default:
    return state;
  }
};

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({
      isSaving: false,
      isLoading: false
    });
  }
  switch (action.type) {
  case '@@router/LOCATION_CHANGE':
    return state.set('isLoading', true);
  case constants.GET_INVOICE_SUCCESS:
    return state.set('isLoading', false);
  default:
    return state;
  }
};

const invoice = combineReducers({
  view,
  details,
  timeslips,
  additionalItems
});

export default invoice;
