'use strict';
import { getCookie } from './user';

// TODO this has a lot of hacky stuff to support npm server.js
export const buildRequest = (path, method='GET', data=null) => {
  const params = {
    method: method,
    mode: 'cors',
    credentials: 'same-origin'
  };
  let headers = {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCookie('csrftoken')
  };

  let url = `/api/${path}`;

  if (data) {
    params.body = JSON.stringify(data);
  }

  if (__USERNAME__) {
    const auth = btoa(__USERNAME__ + ':' + __PASSWORD__);
    headers.Authorization = 'Basic ' + auth;
    url = `http://localhost:8000/${url}`;
  }

  params.headers = new Headers(headers);
  return new Request(url, params);
};

export const createSession = () => {
  return fetch(buildRequest('session/', 'POST')).then(res => res.json());
};

export const fetchTimeslips = (invoice=null, project=null) => {
  let url = `timeslips/?format=json`;

  if (invoice !== null) {
    url = url + `&invoice=${invoice}`;
  }

  if (project !== null) {
    url = url + `&project=${project}`;
  }

  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const fetchProjects = () => {
  return fetch(buildRequest('projects/')).then(
    res => res.json()
  );
};

export const createTimeslips = (timeslips) => {
  const req = buildRequest('timeslips/', 'POST', timeslips.toJS());
  return fetch(req);
};

export const updateTmeslips = (timeslips) => {
  return Promise.all(timeslips.map((t) => {
    const path = `timeslips/${t.get('id')}`;
    return fetch(buildRequest(path, 'PUT', t.toJS()));
  }));
};

export const createInvoice = (project) => {
  const req = buildRequest('invoices/', 'POST', {project: project.get('id')});
  return fetch(req).then(
    res => res.json()
  );
};

export const fetchInvoice = (invoiceId) => {
  return fetch(buildRequest(`invoices/${invoiceId}`)).then(
    res => res.json()
  );
};

export const issueInvoice = (invoiceId, projectId, timeslips) => {
  const req = buildRequest(`invoices/${invoiceId}`, 'PUT', {
    project: projectId,
    timeslips: timeslips.map(t => t.get('id')).toJS()
  });
  return fetch(req).then(res => res.json());
};

export const paidInvoice = (invoiceId, projectId, totalPaid) => {
  const req = buildRequest(`invoices/${invoiceId}`, 'PUT', {
    project: projectId,
    paid: true,
    total_paid: totalPaid
  });
  return fetch(req).then(res => res.json());
};

export const deleteInvoice = (invoiceId) => {
  return fetch(buildRequest(`invoices/${invoiceId}`, 'DELETE'));
};

export const fetchInvoices = (project=null) => {
  let url = 'invoices/';
  if (project !== null) {
    url = url + `&project=${project}`;
  }

  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const fetchInvoiceItems = (invoice=null) => {
  let url = 'invoices/items/';

  if (invoice !== null) {
    url = url + `?invoice=${invoice}`;
  }

  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const createInvoiceItem = (invoiceId, name, price, qty=1) => {
  const req = buildRequest('invoices/items/', 'POST', {
    invoice: invoiceId,
    units: 'Services',
    cost_per_unit: price,
    name: name,
    qty: qty
  });

  return fetch(req).then(
    res => res.json()
  );
};

export const deleteInvoiceItem = (itemId) => {
  return fetch(buildRequest(`invoices/items/${itemId}`, 'DELETE'));
};
