import * as api from 'services/api';

export const fetchTasks = (params={}) => api.get('tasks/', params);
