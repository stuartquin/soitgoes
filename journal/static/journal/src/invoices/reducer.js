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

const invoices = combineReducers({
  projectSummary
});

export default invoices;
