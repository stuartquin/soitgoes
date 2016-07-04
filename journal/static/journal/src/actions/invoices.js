'use strict';
import { push } from 'react-router-redux';

import * as api from '../services/api';
import constants from '../constants';

export const markAsIssued = (invoiceId, projectId, timeslips) => (dispatch) =>
  api.issueInvoice(invoiceId, projectId, timeslips).then(invoice => {
    dispatch({
      type: constants.SAVE_INVOICE_SUCCESS,
      invoice
    });
  });

export const deleteInvoice = (invoiceId) => (dispatch) =>
  api.deleteInvoice(invoiceId).then(() => {
    dispatch(push(`/invoices`));
  });

export const createInvoice = (project) => (dispatch) => {
  dispatch({
    type: constants.CLEAR_INVOICE_TIMESLIPS
  });
  api.createInvoice(project).then(invoice => {
    dispatch({
      type: constants.CREATE_INVOICE_SUCCESS,
      invoice
    });
    dispatch(push(`/invoices/${invoice.id}`));
  });
};

export const fetchInvoice = (invoiceId) => (dispatch) => {
  return api.fetchInvoice(invoiceId).then(invoice =>
    dispatch({
      type: constants.GET_INVOICE_SUCCESS,
      invoice
    })
  );
};

export const fetchInvoices = () => (dispatch) => {
  dispatch({
    type: constants.CLEAR_INVOICE_TIMESLIPS
  });
  api.fetchInvoices().then(invoices =>
    dispatch({
      type: constants.GET_INVOICES_SUCCESS,
      invoices
    })
  );
};

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
