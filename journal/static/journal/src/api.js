import { getUserAuth } from '../services/user';

const baseUrl = 'http://localhost:8000/api/';

export const fetchTimeslips = () => {
  'use strict';
  const auth = getUserAuth();
  const url = baseUrl + `timeslips/?format=json`;

  return fetch(url, getOptions(auth, 'GET')).then(
    res => res.json()
   );
};

