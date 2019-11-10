import * as api from "services/api";

export const fetchTasks = (params = {}) => api.get("tasks/", params);

export const saveTask = async task =>
  task.id ? api.put(`tasks/${task.id}`, task) : api.post("tasks/", task);
