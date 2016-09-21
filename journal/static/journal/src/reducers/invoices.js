'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

const items = (state = Immutable.List([]), action) => {
  switch (action.type) {
  case constants.GET_INVOICES_SUCCESS:
    return Immutable.List(action.invoices.results);
  default:
    return state;
  }
};

const invoices = combineReducers({
  items
});

export default invoices;
