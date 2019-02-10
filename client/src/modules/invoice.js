import { combineReducers } from 'redux';
import Immutable from 'immutable';

import keyById from 'services/keyById';
import * as api from 'services/api';

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

export const deleteInvoice = (invoiceId) => (dispatch) =>
  api.remove('invoices/', invoiceId).then(() => {
    dispatch({
      type: DELETE_INVOICE_SUCCESS,
      invoiceId
    });
  });

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

export const deleteInvoiceModifier = (id, modifierId) => (dispatch) => {
  const path = `invoices/${id}/modifiers/`;
  api.remove(path, modifierId).then(() => dispatch(fetchInvoice(id)));
}

export const addInvoiceModifier = (id, modifierId) => (dispatch) => {
  api.update('invoices/', id, {modifier: [modifierId]}).then(() => {
    dispatch(fetchInvoice(id));
  });
};

export const createInvoice = (projectId) => (dispatch) =>
  api.add('invoices/', {project: projectId})

export const fetchInvoices = () => (dispatch) => {
  dispatch({
    type: GET_INVOICES_START
  });

  api.fetchPath('invoices/').then(res => {
    dispatch({
      type: GET_INVOICES_SUCCESS,
      items: res.results,
      next: res.next,
      count: res.count
    });
  });
};

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

const items = (state = {}, action) => {
  switch (action.type) {
    case DELETE_INVOICE_SUCCESS:
      return Object.values(state).filter(
        o => o.id !== action.invoiceId
      ).map(o => ({
        [o.id]: o
      }));
    case GET_INVOICES_SUCCESS:
      return {
        ...state,
        ...keyById(action.items)
      };
    default:
      return state;
  }
};

const view = (state, action) => {
  if (!state) {
    return Immutable.Map({
      isLoading: true,
      next: null
    });
  }
  switch (action.type) {
  case GET_INVOICES_START:
    return state.merge({isLoading: true});
  case GET_INVOICES_SUCCESS:
    return state.merge({
      isLoading: false,
      next: action.next
    });
  default:
    return state;
  }
};

const invoices = combineReducers({
  items,
  view
});

export default invoices;
