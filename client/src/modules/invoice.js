import { combineReducers } from 'redux';

import * as api from 'services/api';
import reduxHelper from 'services/reduxHelper';

const NS = 'INVOICES';
const GET_INVOICES_START = 'GET_INVOICES_START';
const GET_INVOICES_SUCCESS = 'GET_INVOICES_SUCCESS';
const DELETE_INVOICE_SUCCESS = 'DELETE_INVOICE_SUCCESS';

export const updateInvoice = (id, form) => (dispatch) => {
  const path = 'invoices/';
  return api.update(path, id, form).then(res =>
    dispatch({
      type: GET_INVOICES_SUCCESS,
      items: [res]
    })
  );
};

export const deleteInvoice = (invoiceId) => (dispatch) => (
  api.remove('invoices/', invoiceId).then(() => {
    dispatch({
      type: DELETE_INVOICE_SUCCESS,
      invoiceId
    });
  })
);

export const createInvoice = (projectId) => (dispatch) => (
  api.add('invoices/', {project: projectId})
);

const _saveInvoice = (invoice) => (
  invoice.id ?
    api.put(`invoices/${invoice.id}`, invoice) :
    api.post('invoices/', invoice)
);

export const saveInvoice = reduxHelper.save(NS, _saveInvoice);

export const fetchInvoices = reduxHelper.fetch(
  NS,
  () => api.get(`invoices/`)
);

export const fetchInvoice = reduxHelper.fetchOne(
  NS,
  (id, params = {}) => api.get(`invoices/${id}`, params)
);

const items = reduxHelper.items(NS);
const results = reduxHelper.results(NS);

const invoices = combineReducers({
  items,
  results,
});

export default invoices;
