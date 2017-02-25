'use strict';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import constants from '../constants';

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
  view
});

export default invoice;
