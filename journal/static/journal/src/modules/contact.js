import Immutable from 'immutable';
import { combineReducers } from 'redux';

import getById from 'services/getById';
import * as api from 'services/api';

const GET_CONTACTS_START = 'GET_CONTACTS_START';
const GET_CONTACTS_SUCCESS = 'GET_CONTACTS_SUCCESS';

export const fetchContacts = () => (dispatch) => {
  dispatch({
    type: GET_CONTACTS_START
  });
  api.fetchPath('contacts/').then(res => {
    let items = [];
    if (res.results) {
      items = res.results;
    } else {
      items = [res];
    }
    dispatch({
      type: GET_CONTACTS_SUCCESS,
      items
    });
  });
};

export const addContact = (form) => (dispatch) => {
  dispatch({
    type: GET_CONTACTS_START
  });

  api.add('contacts/', form).then(res => {
    dispatch({
      type: GET_CONTACTS_SUCCESS,
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
  case GET_CONTACTS_SUCCESS:
    return state.merge(getById(action.items));
  default:
    return state;
  }
};

const contacts = combineReducers({
  items,
  view
});

export default contacts;
