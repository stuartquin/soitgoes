'use strict';
import constants from '../constants';
import { getOptions } from '../services/api';

const baseUrl = 'http://localhost:8000/api/';

export const createInvoice = (auth, project) => {
  const url = baseUrl + `invoices/`;
  let options = getOptions(auth, 'POST');
  options.body = JSON.stringify(timeslips).toJS();

  return (dispatch) => {
    return fetch(url, options);
  };
};
