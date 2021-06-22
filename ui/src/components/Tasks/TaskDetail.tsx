import React, { useCallback, useEffect, useState } from "react";

import * as models from "api/models";
import { getClient } from "apiClient";

import TaskForm from "components/Tasks/TaskForm";
import TaskLoading from "components/Tasks/TaskLoading";
import Button from "components/Button";

interface Props {
  taskId: string;
}

function TaskDetail({ taskId }: Props) {
  const [task, setTask] = useState<models.Task>();

  useEffect(() => {
    const load = async () => {
      const api = getClient();
      setTask(await api.retrieveTask({ id: taskId }));
    };
    load();
  }, [taskId]);

  const saveTask = useCallback(async () => {
    if (task) {
      const api = getClient();
      await api.updateTask({ id: taskId, task });
    }
  }, [task, taskId]);

  return task ? (
    <div>
      <div className="flex justify-between">
        <div className="text-gray-800 text-md sm:text-lg">{task.name}</div>
        <Button variant="success" onClick={saveTask}>
          Save
        </Button>
      </div>
      <TaskForm task={task} onUpdate={setTask} />
    </div>
  ) : (
    <TaskLoading />
  );
}

export default TaskDetail;
