'use strict';
import Immutable from 'immutable';
import { combineReducers } from 'redux';

import * as api from '../services/api';

const GET_COMPANIES_START = 1;
const GET_COMPANIES_SUCCESS = 2;

export const fetchCompanies = () => (dispatch) => {
  dispatch({
    type: GET_COMPANIES_START
  });
  api.fetchPath('companies/').then(res => {
    let items = [];
    if (res.results) {
      items = res.results;
    } else {
      items = [res];
    }
    dispatch({
      type: GET_COMPANIES_SUCCESS,
      items
    });
  });
};

export const addCompany = (form) => (dispatch) => {
  dispatch({
    type: GET_COMPANIES_START
  });

  api.add('companies/', form).then(res => {
    dispatch({
      type: GET_COMPANIES_SUCCESS,
      items: [res]
    });
  });
};

const getById = (items) => {
  let map = Immutable.OrderedMap();
  items.forEach(item => map = map.set(
    item.id,
    Immutable.fromJS(item)
  ))
  return map;
};

const view = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  default:
    return state;
  }
};

const items = (state = Immutable.OrderedMap({}), action) => {
  switch(action.type) {
  case GET_COMPANIES_SUCCESS:
    return state.merge(getById(action.items));
  default:
    return state;
  }
};

const companies = combineReducers({
  items,
  view
});

export default companies;
