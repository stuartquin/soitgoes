import Immutable from 'immutable';
import { combineReducers } from 'redux';

import reduxHelper from 'services/reduxHelper';
import * as api from 'services/api';
import { addFlashMessage } from 'modules/flashmessage';

const NS = 'CONTACTS';
const GET_CONTACTS_START = 'GET_CONTACTS_START';
const GET_CONTACTS_SUCCESS = 'GET_CONTACTS_SUCCESS';

export const fetchContacts = reduxHelper.fetch(NS, () => api.fetchPath('contacts/'));


export const addContact = (form) => (dispatch) => {
  dispatch({
    type: GET_CONTACTS_START
  });

  return api.add('contacts/', form).then(res => {
    const text = `Added contact ${res.name}`;
    const link = `/contacts/${res.id}`;
    const action = 'View';

    dispatch(addFlashMessage({ text, action, link }));
    dispatch({
      type: GET_CONTACTS_SUCCESS,
      items: [res]
    });
  });
};

export const updateContact = (id, form) => (dispatch) => {
  dispatch({
    type: GET_CONTACTS_START
  });

  return api.update('contacts/', id, form).then(res => {
    dispatch({
      type: GET_CONTACTS_SUCCESS,
      items: [res]
    });
  });
};

const items = reduxHelper.items(NS);
const results = reduxHelper.results(NS);

const contacts = combineReducers({
  items,
  results,
});

export default contacts;
