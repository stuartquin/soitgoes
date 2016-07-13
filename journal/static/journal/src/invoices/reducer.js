'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const projectSummary = (state = Immutable.Map(), action) => {
  switch (action.type) {
  case constants.GET_PROJECTS_SUCCESS:
    return Immutable.fromJS(action.projects);
  default:
    return state;
  }
};

const invoice = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  case constants.GET_INVOICE_SUCCESS:
  case constants.CREATE_INVOICE_SUCCESS:
  case constants.SAVE_INVOICE_SUCCESS:
    return Immutable.fromJS(action.invoice);
  case constants.DELETE_INVOICE_SUCCESS:
    return Immutable.Map({});
  case constants.ADD_INVOICE_ITEM_SUCCESS:
    return state.set('invoiceItems', action.invoiceItems);
  default:
    return state;
  }
};

const timeslips = (state = Immutable.List([]), action) => {
  switch (action.type) {
  case constants.GET_INVOICE_TIMESLIPS_SUCCESS:
    return state.concat(Immutable.fromJS(action.timeslips));
  case constants.CLEAR_INVOICE_TIMESLIPS:
    return Immutable.List([]);
  default:
    return state;
  }
};

const items = (state = Immutable.List([]), action) => {
  switch (action.type) {
  case constants.GET_INVOICES_SUCCESS:
    return Immutable.List(action.invoices.results);
  default:
    return state;
  }
};

const invoices = combineReducers({
  projectSummary,
  invoice,
  timeslips,
  items
});

export default invoices;
