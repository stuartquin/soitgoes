'use strict';
import { push } from 'react-router-redux';

import * as api from '../services/api';
import constants from '../constants';

export const createInvoice = (project) => (dispatch) =>
  api.createInvoice(project).then(invoice => {
    dispatch({
      type: constants.CREATE_INVOICE_SUCCESS,
      invoice
    });
    dispatch(push(`/invoice/${invoice.id}`));
  });

export const fetchInvoice = (invoiceId) => (dispatch) =>
  api.fetchInvoice(invoiceId).then(invoice => {
    dispatch({
      type: constants.GET_INVOICE_SUCCESS,
      invoice
    });
  });
