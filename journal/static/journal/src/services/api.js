'use strict';
import { getUserAuth, getCookie } from './user';

const baseUrl = '/api/';

export const getOptions = (auth, method) => {
  return {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };
};

export const buildRequest = (path, method='GET', data=null) => {
  const params = {
    method: method,
    mode: 'cors',
    credentials: 'same-origin',
    headers: new Headers({
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    })
  };
  if (data) {
    params.body = JSON.stringify(data);
  }

  return new Request(`/api/${path}`, params);
};

export const createSession = (username, password) => {
  const auth = getUserAuth();
  const url = baseUrl + `session/`;
  let options = getOptions(auth, 'POST');
  options.body = JSON.stringify({
    username,
    password
  });

  return fetch(url, options).then(
    res => res.json()
  );
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
  return timeslips.map((t) => {
    return fetch(buildRequest('timeslips/', 'PUT', t.toJS()));
  });
};

export const createInvoice = (project) => {
  const auth = getUserAuth();
  const url = baseUrl + `invoices/`;
  let options = getOptions(auth, 'POST');
  options.body = JSON.stringify({
    project: project.get('id')
  });
  return fetch(url, options).then(
    res => res.json()
  );
};

export const fetchInvoice = (invoiceId) => {
  const auth = getUserAuth();
  const url = baseUrl + `invoices/${invoiceId}`;

  return fetch(url, getOptions(auth, 'GET')).then(
    res => res.json()
  );
};

export const issueInvoice = (invoiceId, projectId, timeslips) => {
  const auth = getUserAuth();
  const url = baseUrl + `invoices/${invoiceId}`;
  const options = getOptions(auth, 'PUT');
  options.body = JSON.stringify({
    project: projectId,
    timeslips: timeslips.map(t => t.get('id')).toJS()
  });
  return fetch(url, options).then(
    res => res.json()
  );
};

export const deleteInvoice = (invoiceId) => {
  const auth = getUserAuth();
  const url = baseUrl + `invoices/${invoiceId}`;
  const options = getOptions(auth, 'DELETE');
  return fetch(url, options);
};

export const fetchInvoices = (project=null) => {
  const auth = getUserAuth();
  let url = baseUrl + `invoices/`;
  if (project !== null) {
    url = url + `&project=${project}`;
  }

  return fetch(url, getOptions(auth, 'GET')).then(
    res => res.json()
  );
};

export const addInvoiceItem = (invoiceId, name, price) => {
  console.log(invoiceId, name, price);
}
