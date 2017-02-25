'use strict';
import { push } from 'react-router-redux';

import * as api from '../services/api';
import constants from '../constants';

export const updateInvoice = (invoiceId, projectId, updates) => (dispatch) =>
  api.updateInvoice(invoiceId, projectId, updates).then(invoice => {
    dispatch({
      type: constants.SAVE_INVOICE_SUCCESS,
      invoice
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
    dispatch({
      type: constants.DELETE_INVOICE_SUCCESS,
      invoiceId
    });
    dispatch(push(`/invoices`));
  });

export const deleteInvoiceModifier = (invoiceId, invoiceModifierId) => (dispatch) =>
  api.deleteInvoiceModifier(invoiceId, invoiceModifierId).then(() => {
    dispatch(fetchInvoice(invoiceId));
  });

export const createInvoice = (project, isVAT) => (dispatch) => {
  dispatch({
    type: constants.CLEAR_INVOICE_TIMESLIPS
  });
  api.createInvoice(project, isVAT).then(invoice => {
    dispatch({
      type: constants.CREATE_INVOICE_SUCCESS,
      invoice
    });
    dispatch(push(`/invoices/${invoice.id}`));
  });
};

export const fetchInvoice = (invoiceId) => (dispatch) => {
  dispatch({
    type: constants.GET_INVOICE_START
  });

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
  api.fetchInvoices().then(res => {
    const invoices = res.results;
    dispatch({
      type: constants.GET_INVOICES_SUCCESS,
      invoices
    });
  });
};

export const fetchInvoiceTimeslips = (invoiceId) => (dispatch) => {
  api.fetchTimeslips(invoiceId, null, null).then(res => {
    dispatch({
      type: constants.GET_TIMESLIPS_SUCCESS,
      timeslips: res.results
    });
  });
};

export const fetchInvoiceTasks = (invoiceId) => (dispatch) =>
  api.fetchTasks(null, null, invoiceId).then(res => {
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks: res.results
    });
  });

export const deleteInvoiceTimeslip = (invoiceId, timeslipId) => (dispatch) => {
  const updates = {
    invoice: null
  };
  api.updateTimeslips([timeslipId], updates).then((timeslips) => {
    dispatch({
      type: constants.GET_TIMESLIPS_SUCCESS,
      timeslips
    });
    dispatch(fetchInvoiceTimeslips(invoiceId));
  });
};

export const deleteInvoiceTask = (invoiceId, taskId) => (dispatch) => {
  api.updateTask(taskId, {invoice: null}).then((res) => {
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks: [res]
    });
    dispatch(fetchInvoiceTasks(invoiceId));
  });
};
