'use strict';
import { getUserAuth } from './user';

const baseUrl = 'http://localhost:8000/api/';

export const getOptions = (auth, method) => {
  return {
    method: method,
    headers: {
      Authorization: 'Basic ' + auth,
      'Content-Type': 'application/json'
    }
  };
};

export const fetchTimeslips = (invoice=null, project=null) => {
  const auth = getUserAuth();
  let url = baseUrl + `timeslips/?format=json`;

  if (invoice !== null) {
    url = url + `&invoice=${invoice}`;
  }

  if (project !== null) {
    url = url + `&project=${project}`;
  }

  return fetch(url, getOptions(auth, 'GET')).then(
    res => res.json()
  );
};

export const fetchProjects = () => {
  const auth = getUserAuth();
  const url = baseUrl + `projects/`;

  return fetch(url, getOptions(auth, 'GET')).then(
    res => res.json()
  );
};

export const createTimeslips = (timeslips) => {
  const auth = getUserAuth();
  const url = baseUrl + `timeslips/`;
  let options = getOptions(auth, 'POST');
  options.body = JSON.stringify(timeslips.toJS());
  return fetch(url, options);
};

export const updateTmeslips = (timeslips) => {
  const auth = getUserAuth();
  const url = baseUrl + `timeslips/`;
  return timeslips.map((t) => {
    let options = getOptions(auth, 'PUT');
    options.body = JSON.stringify(t.toJS());
    return fetch(url + t.get('id'), options);
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
