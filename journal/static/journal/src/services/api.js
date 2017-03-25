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

export const fetchByIds = (type, ids) => {
  let url = `${type}/?ids=${ids.join(',')}`;
  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const createInvoice = (project, isVAT) => {
  const req = buildRequest('invoices/', 'POST', {
    project: project.get('id'),
    isVAT
  });
  return fetch(req).then(
    res => res.json()
  );
};

export const fetchInvoiceModifiers = (invoiceId) => {
  return fetch(buildRequest(`invoices/${invoiceId}/modifiers`)).then(
    res => res.json()
  );
};

export const deleteInvoiceModifier = (invoiceId, invoiceModifierId) => {
  return fetch(
    buildRequest(
      `invoices/${invoiceId}/modifiers/${invoiceModifierId}`,
      'DELETE'
    )
  );
};

export const updateInvoice = (invoiceId, projectId, updates) => {
  if (updates.due_date === '') {
    updates.due_date = null;
  }

  const body = {
    project: projectId,
    ...updates
  };
  const req = buildRequest(`invoices/${invoiceId}`, 'PUT', body);
  return fetch(req).then(res => res.json());
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

export const deleteInvoiceTask = (itemId) => {
  return fetch(buildRequest(`invoices/items/${itemId}`, 'DELETE'));
};

export const fetchPath = (path, params={}) => {
  const qs = Object.keys(params).map(p => {
    if (params[p] !== null) {
      return `${p}=${params[p]}`;
    } else {
      return '';
    }
  }).join('&');
  let url = path
  if (qs) {
    url = `${url}?${qs}`;
  }

  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const add = (path, form) => {
  const req = buildRequest(path, 'POST', form);
  return fetch(req).then(res => res.json());
};

export const remove = (path, id) => {
  return fetch(buildRequest(`${path}${id}`, 'DELETE'));
};

export const update = (path, id, form) => {
  const req = buildRequest(`${path}${id}`, 'PUT', form);
  return fetch(req).then(res => res.json());
};

export const fetchAccounts = () => {
  return fetch(buildRequest('accounts/')).then(
    res => res.json()
  );
};

export const fetchUser = () => {
  return fetch(buildRequest('user/')).then(
    res => res.json()
  );
};

export const fetchVersion = () => {
  return fetch(buildRequest('version/')).then(
    res => res.json()
  );
};

export const fetchActivityFeed = () => {
  return fetch(buildRequest('activity/')).then(
    res => res.json()
  );
};

export const fetchSummary = (type, start, end) => {
  let url = `summary/${type}/`;
  url = url + `?start=${start}&end=${end}`;

  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const fetchExpenses = (start, end) => {
  let url = `expenses/`;
  url = url + `?start=${start}&end=${end}`;

  return fetch(buildRequest(url)).then(
    res => res.json()
  );
};

export const fetchTasks = (id=null, project=null, invoice=null) => {
  let url = 'tasks/';
  let query = [];
  if (id) {
    url += id;
  }
  if (project !== null) {
    query.push(`project=${project}`);
  }

  if (invoice !== null) {
    query.push(`invoice=${invoice}`);
  }
  url = `${url}?${query.join('&')}`;

  return fetch(buildRequest(url)).then((res) => {
    const json = res.json();
    return json;
  });
};

export const updateTask = (taskId, updates) => {
  const req = buildRequest(`tasks/${taskId}`, 'PUT', updates);
  return fetch(req).then(res => res.json());
};

export const addTask = (form) => {
  const req = buildRequest(`tasks/`, 'POST', form);
  return fetch(req).then(res => res.json());
};

export const login = (form) => {
  const req = buildRequest(`login/`, 'POST', form);
  return fetch(req);
};

export const logout = (form) => {
  const req = buildRequest(`logout/`);
  return fetch(req);
};
