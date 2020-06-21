import * as api from 'services/api';

export const fetchTasks = (params = {}) => api.get('tasks/', params);

export const saveTask = async (task) =>
  task.id ? api.put(`tasks/${task.id}`, task) : api.post('tasks/', task);

export const getTaskTotal = (task, timeslips) =>
  task.billing_type === 'TIME'
    ? timeslips.reduce((total, { cost }) => total + cost, 0)
    : task.cost;
