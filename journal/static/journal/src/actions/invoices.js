'use strict';
import { push } from 'react-router-redux';
import { normalize } from 'normalizr';

import * as api from '../services/api';
import constants from '../constants';
import * as schema from '../actions/schema';

export const addItem = (invoiceId, name, price) => (dispatch) =>
  api.addInvoiceItem(invoiceId, name, price).then(item => {
    dispatch({
      type: constants.ADD_INVOICE_ITEM_SUCCESS,
      item
    });
  });

export const markAsIssued = (invoiceId, projectId, timeslips) => (dispatch) =>
  api.issueInvoice(invoiceId, projectId, timeslips).then(invoice => {
    dispatch({
      type: constants.SAVE_INVOICE_SUCCESS,
      invoice
    });
  });

export const markAsPaid = (invoiceId, projectId, totalPaid) => (dispatch) =>
  api.paidInvoice(invoiceId, projectId, totalPaid).then(invoice => {
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
  api.fetchTimeslips(invoiceId).then(res => {
    dispatch({
      type: constants.GET_INVOICE_TIMESLIPS_SUCCESS,
      timeslips: res.results
    });
  });

export const fetchProjectTimeslips = (projectId) => (dispatch) =>
  api.fetchTimeslips('none', projectId).then(res => {
    dispatch({
      type: constants.GET_INVOICE_TIMESLIPS_SUCCESS,
      timeslips: res.resuslts
    });
  });
