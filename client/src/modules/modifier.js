import { combineReducers } from 'redux';

import keyById from 'services/keyById';
import * as api from 'services/api';
import reduxHelper from 'services/reduxHelper';

const NS = 'MODIFIERS';
const GET_MODIFIERS_START = 'GET_MODIFIER_START';
const GET_MODIFIERS_SUCCESS = 'GET_MODIFIER_SUCCESS';

export const fetchModifiers = reduxHelper.fetch(
  NS,
  () => api.get('modifiers/')
);

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

const items = reduxHelper.items(NS);

const modifiers = combineReducers({
  items,
});

export default modifiers;
