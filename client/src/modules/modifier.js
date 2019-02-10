import { combineReducers } from 'redux';

import keyById from 'services/keyById';
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

const items = (state = {}, action) => {
  switch(action.type) {
  case GET_MODIFIERS_SUCCESS:
    return {
      ...state,
      ...keyById(action.items)
    };
  default:
    return state;
  }
};

const modifiers = combineReducers({
  items,
});

export default modifiers;
