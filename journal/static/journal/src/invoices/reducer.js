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
    return Immutable.fromJS(action.invoice);
  default:
    return state;
  }
};

const timeslips = (state = Immutable.List([]), action) => {
  switch (action.type) {
  case constants.GET_INVOICE_TIMESLIPS_SUCCESS:
    return state.merge(action.timeslips);
  default:
    return state;
  }
};

const invoices = combineReducers({
  projectSummary,
  invoice,
  timeslips
});

export default invoices;
