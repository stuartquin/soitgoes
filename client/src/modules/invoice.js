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

export const deleteInvoiceModifier = (id, modifierId) => (dispatch) => {
  const path = `invoices/${id}/modifiers/`;
  api.remove(path, modifierId).then(() => dispatch(fetchInvoice(id)));
}

export const addInvoiceModifier = (id, modifierId) => (dispatch) => {
  api.update('invoices/', id, {modifier: [modifierId]}).then(() => {
    dispatch(fetchInvoice(id));
  });
};

export const createInvoice = (projectId) => (dispatch) => (
  api.add('invoices/', {project: projectId})
);

export const fetchInvoices = reduxHelper.fetch(
  NS,
  () => api.fetchPath(`invoices/`)
);

export const fetchInvoice = reduxHelper.fetch(
  NS,
  (id) => api.fetchPath(`invoices/${id}`)
);

export const fetchNext = (next) => (dispatch) => {
  if (next) {
    api.paginate(next).then(res => {
      dispatch({
        type: GET_INVOICES_SUCCESS,
        items: res.results,
        next: res.next,
        count: res.count
      });
    });
  }
};

const items = reduxHelper.items(NS);
const results = reduxHelper.results(NS);

const invoices = combineReducers({
  items,
  results,
});

export default invoices;
