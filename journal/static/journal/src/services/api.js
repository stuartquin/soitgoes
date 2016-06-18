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

export const fetchTimeslips = () => {
  const auth = getUserAuth();
  const url = baseUrl + `timeslips/?format=json`;

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
