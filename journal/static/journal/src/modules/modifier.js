import Immutable from 'immutable';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';

const GET_MODIFIERS_START = 'GET_MODIFIER_START';
const GET_MODIFIERS_SUCCESS = 'GET_MODIFIER_SUCCESS';

export const fetchModifiers = () => (dispatch) => {
  dispatch({
    type: GET_MODIFIERS_START
  });
  api.fetchPath('modifiers/').then(res => {
    dispatch({
      type: GET_MODIFIERS_SUCCESS,
      items: res.results
    });
  });
};

export const addModifier = (form) => (dispatch) => {
  dispatch({
    type: GET_MODIFIERS_START
  });

  api.add('modifiers/', form).then(res => {
    dispatch({
      type: GET_MODIFIERS_SUCCESS,
      items: [res]
    });
  });
};

export const updateModifier = (id, form) => (dispatch) => {
  dispatch({
    type: GET_MODIFIERS_START
  });

  api.update('modifiers/', id, form).then(res => {
    dispatch({
      type: GET_MODIFIERS_SUCCESS,
      items: [res]
    });
  });
};

const view = (state = Immutable.Map({}), action) => {
  switch (action.type) {
  default:
    return state;
  }
};

const items = (state = Immutable.OrderedMap({}), action) => {
  switch(action.type) {
  case GET_MODIFIERS_SUCCESS:
    return state.merge(getById(action.items));
  default:
    return state;
  }
};

const modifiers = combineReducers({
  items,
  view
});

export default modifiers;
