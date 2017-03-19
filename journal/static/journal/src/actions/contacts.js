'use strict';
import * as api from '../services/api';
import constants from '../constants';

export const fetchContacts = () => (dispatch) => {
  dispatch({
    type: constants.GET_CONTACTS_START
  });
  api.fetchContacts().then(res => {
    let items = [];
    if (res.results) {
      items = res.results;
    } else {
      items = [res];
    }
    dispatch({
      type: constants.GET_CONTACTS_SUCCESS,
      items
    });
  });
};

export const addContact = (form) => (dispatch) => {
  dispatch({
    type: constants.UPDATE_CONTACT_START
  });

  api.addContact(form).then(res => {
    dispatch({
      type: constants.GET_CONTACTS_SUCCESS,
      items: [res]
    });
  });
};
