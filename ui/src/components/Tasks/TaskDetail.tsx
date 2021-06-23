import React, { useMemo, useCallback, useEffect, useState } from "react";

import * as models from "api/models";
import { getClient } from "apiClient";

import TaskForm from "components/Tasks/TaskForm";
import TaskLoading from "components/Tasks/TaskLoading";
import TaskInvoices from "components/Tasks/TaskInvoices";
import TaskTimeSlips from "components/Tasks/TaskTimeSlips";
import Button from "components/Button";

interface Props {
  taskId: string;
}

function TaskDetail({ taskId }: Props) {
  const [task, setTask] = useState<models.Task>();
  const [summary, setSummary] = useState<models.TaskSummary>();

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      setTask(await api.retrieveTask({ id: taskId }));

      setSummary(await api.retrieveTaskSummary({ id: taskId }));
    };
    load();
  }, [taskId]);

  const saveTask = useCallback(async () => {
    if (task) {
      const api = getClient();
      await api.updateTask({ id: taskId, task });
    }
  }, [task, taskId]);

  const invoices = useMemo(() => {
    return summary ? (summary.invoices as models.Invoice[]) : [];
  }, [summary]);

  const timeSlips = useMemo(() => {
    return summary ? (summary.timeslips as models.TimeSlip[]) : [];
  }, [summary]);

  return task ? (
    <div>
      <div className="flex justify-between">
        <div className="text-gray-800 text-md sm:text-lg">{task.name}</div>
        <Button variant="success" onClick={saveTask}>
          Save
        </Button>
      </div>
      <TaskForm task={task} onUpdate={setTask} />
      {invoices.length > 0 && <TaskInvoices task={task} invoices={invoices} />}
      {timeSlips.length > 0 && (
        <TaskTimeSlips task={task} timeSlips={timeSlips} />
      )}
    </div>
  ) : (
    <TaskLoading />
  );
}

export default TaskDetail;
