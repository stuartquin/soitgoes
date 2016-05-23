'use strict';
import constants from '../constants';
import { getProjects } from './api';

export const setUserAuth = (fields) => {
  const auth = btoa(`${fields.username}:${fields.password}`);
  document.cookie = `soitgoes_auth=${auth}`;

  // TODO maybe a better way?
  // In future it should probably get user profile or something
  return getProjects(auth);
};
