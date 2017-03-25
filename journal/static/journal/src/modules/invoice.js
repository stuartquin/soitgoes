'use strict';
import { push } from 'react-router-redux';
import { combineReducers } from 'redux';
import Immutable from 'immutable';

import getById from 'services/getById';
import * as api from 'services/api';
import constants from '../constants';
import { GET_TIMESLIPS_SUCCESS } from 'modules/timeslip';

const GET_INVOICES_START = 'GET_INVOICES_START';
const GET_INVOICES_SUCCESS = 'GET_INVOICES_SUCCESS';
const DELETE_INVOICE_SUCCESS = 'DELETE_INVOICE_SUCCESS';
const CREATE_INVOICE_SUCCESS = 'CREATE_INVOICE_SUCCESS';

export const updateInvoice = (id, form) => (dispatch) => {
  const path = 'invoices/';
  return api.update(path, id, form).then(res =>
    dispatch({
      type: GET_INVOICES_SUCCESS,
      items: [res]
    })
  );
};

export const deleteInvoice = (invoiceId) => (dispatch) =>
  api.deleteInvoice(invoiceId).then(() => {
    dispatch({
      type: DELETE_INVOICE_SUCCESS,
      invoiceId
    });
    dispatch(push(`/invoices`));
  });

export const deleteInvoiceModifier = (invoiceId, invoiceModifierId) => (dispatch) =>
  api.deleteInvoiceModifier(invoiceId, invoiceModifierId).then(() => {
    dispatch(fetchInvoice(invoiceId));
  });

export const addInvoiceModifier = (id, modifierId) => (dispatch) => {
  api.update('invoices/', id, {modifier: [modifierId]}).then(() => {
    dispatch(fetchInvoice(id));
  });
};

export const createInvoice = (project, isVAT) => (dispatch) => {
  api.createInvoice(project, isVAT).then(invoice => {
    dispatch({
      type: CREATE_INVOICE_SUCCESS,
      invoice
    });
    dispatch(push(`/invoices/${invoice.id}`));
  });
};

export const fetchInvoice = (id) => (dispatch) => {
  dispatch({
    type: GET_INVOICES_START
  });

  return api.fetchPath(`invoices/${id}`).then(res =>
    dispatch({
      type: GET_INVOICES_SUCCESS,
      items: [res]
    })
  );
};

export const fetchInvoices = () => (dispatch) => {
  dispatch({
    type: GET_INVOICES_START
  });

  api.fetchPath('invoices/').then(res => {
    const invoices = res.results;
    dispatch({
      type: GET_INVOICES_SUCCESS,
      items: invoices
    });
  });
};

export const fetchInvoiceTimeslips = (id) => (dispatch) => {
  return api.fetchPath('timeslips/', {invoice: id}).then(res =>
    dispatch({
      type: GET_TIMESLIPS_SUCCESS,
      timeslips: res.results
    })
  );
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
      type: GET_TIMESLIPS_SUCCESS,
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

const items = (state = Immutable.OrderedMap(), action) => {
  switch (action.type) {
  case DELETE_INVOICE_SUCCESS:
    return state.delete(action.invoiceId);
  case GET_INVOICES_SUCCESS:
    return state.merge(getById(action.items));
  default:
    return state;
  }
};

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({
      isLoading: true
    });
  }
  switch (action.type) {
  case GET_INVOICES_START:
    return state.merge({isLoading: true});
  case GET_INVOICES_SUCCESS:
    return state.merge({isLoading: false});
  default:
    return state;
  }
};

const invoices = combineReducers({
  items,
  view
});

export default invoices;
