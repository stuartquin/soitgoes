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
    dispatch(push(`/invoices`));
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

  return api.fetchInvoiceModifiers(invoiceId).then((res) => {
    const modifiers = res.results;
    dispatch({
      type: constants.GET_INVOICE_MODIFIERS_SUCCESS,
      modifiers
    });
    return api.fetchInvoice(invoiceId);
  }).then(invoice =>
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

export const fetchInvoiceItems = (invoiceId) => (dispatch) =>
  api.fetchInvoiceItems(invoiceId).then(res => {
    dispatch({
      type: constants.GET_INVOICE_ITEMS_SUCCESS,
      items: res.results
    });
  });

export const fetchInvoiceTasks = (invoiceId) => (dispatch) =>
  api.fetchTasks(null, null, invoiceId).then(res => {
    dispatch({
      type: constants.GET_TASKS_SUCCESS,
      tasks: res.results
    });
  });

export const deleteInvoiceTimeslip = (invoiceId, timeslip) => (dispatch) => {
  api.updateTimeslips([timeslip.set('invoice', null)]).then((timeslips) => {
    dispatch({
      type: constants.GET_TIMESLIPS_SUCCESS,
      timeslips
    });
    dispatch(fetchInvoiceTimeslips(invoiceId));
  });
};

export const deleteInvoiceItem = (invoiceId, itemId) => (dispatch) => {
  api.deleteInvoiceItem(itemId).then(() => {
    dispatch(fetchInvoiceItems(invoiceId));
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

export const createItem = (invoiceId, name, price, qty) => (dispatch) =>
  api.createInvoiceItem(invoiceId, name, price, qty).then(item => {
    dispatch({
      type: constants.CREATE_INVOICE_ITEM_SUCCESS,
      item
    });
    dispatch(fetchInvoiceItems(invoiceId));
  });
