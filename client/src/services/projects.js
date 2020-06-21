import * as api from 'services/api';

export const getContactName = (project, contacts) => {
  return contacts[project.contact] ? contacts[project.contact].name : '';
};

export const fetchSummary = (params) => api.get('projects/summary/', params);
