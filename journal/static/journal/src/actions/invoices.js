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
    dispatch(push(`/invoices/${invoice.id}`));
  });

export const fetchInvoice = (invoiceId) => (dispatch) =>
  api.fetchInvoice(invoiceId).then(invoice =>
    dispatch({
      type: constants.GET_INVOICE_SUCCESS,
      invoice
    })
  );

export const fetchInvoiceTimeslips = (invoiceId) => (dispatch) =>
  api.fetchTimeslips(invoiceId).then(timeslips =>
    dispatch({
      type: constants.GET_INVOICE_TIMESLIPS_SUCCESS,
      timeslips
    })
  );

export const fetchProjectTimeslips = (projectId) => (dispatch) =>
  api.fetchTimeslips('none', projectId).then(timeslips =>
    dispatch({
      type: constants.GET_INVOICE_TIMESLIPS_SUCCESS,
      timeslips
    })
  );
