import React, { useCallback } from "react";
import { format } from "date-fns";

import * as models from "api/models";

interface Props {
  task: models.Task;
  onUpdate?: (task: models.Task) => void;
}

function TaskForm({ task, onUpdate }: Props) {
  const updateTask = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target as HTMLInputElement;
      const { name } = target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      onUpdate && onUpdate({ ...task, [name]: value });
    },
    [task, onUpdate]
  );

  const updateDate = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.target;
      onUpdate && onUpdate({ ...task, [name]: new Date(value) });
    },
    [task, onUpdate]
  );

  const isBillingTypeDisabled = Boolean(task.id);

  return (
    <form action="#" method="POST" className="w-full sm:w-auto">
      <div className="my-4 flex">
        <div className="flex-grow mr-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            value={task.name || ""}
            onChange={updateTask}
            id="name"
            className="block w-full rounded-none sm:text-sm border border-gray-300 rounded p-2 h-9"
          />
        </div>
        <div className="w-1/4">
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-700"
          >
            State
          </label>
          <select
            name="state"
            id="state"
            className="block w-full rounded-none sm:text-sm border border-gray-300 rounded p-2 h-9"
            value={task.state}
            onChange={updateTask}
          >
            {Object.values(models.TaskStateEnum).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="my-4 flex">
        <div className="flex-grow mr-2 w-1/2">
          <label
            htmlFor="billingType"
            className="block text-sm font-medium text-gray-700"
          >
            Billing Type
          </label>
          <select
            name="billingType"
            id="billingType"
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
            value={task.billingType}
            onChange={updateTask}
            disabled={isBillingTypeDisabled}
          >
            {Object.values(models.TaskBillingTypeEnum).map((billingType) => (
              <option key={billingType} value={billingType}>
                {billingType}
              </option>
            ))}
          </select>
        </div>
        {task.billingType === models.TaskBillingTypeEnum.Fixed ? (
          <div className="flex-grow mr-2 w-1/2">
            <label
              htmlFor="cost"
              className="block text-sm font-medium text-gray-700"
            >
              Cost
            </label>
            <input
              type="text"
              name="cost"
              value={task.cost || ""}
              onChange={updateTask}
              id="cost"
              className="block w-full rounded-none sm:text-sm border border-gray-300 rounded p-2 h-9"
            />
          </div>
        ) : (
          <div className="flex-grow mr-2 w-1/2">
            <label
              htmlFor="hoursPredicted"
              className="block text-sm font-medium text-gray-700"
            >
              Hours Predicted
            </label>
            <input
              type="text"
              name="hoursPredicted"
              value={task.hoursPredicted || ""}
              onChange={updateTask}
              id="hoursPredicted"
              className="block w-full rounded-none sm:text-sm border border-gray-300 rounded p-2 h-9"
            />
          </div>
        )}
      </div>

      <div className="my-4 flex">
        <div className="flex-grow mr-2 w-1/2">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Due Date
          </label>
          <input
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
            type="date"
            name="dueDate"
            id="dueDate"
            value={format(task.dueDate || new Date(), "yyyy-MM-dd")}
            onChange={updateDate}
          />
        </div>
        <div className="flex-grow mr-2 w-1/2">
          <label
            htmlFor="completedAt"
            className="block text-sm font-medium text-gray-700"
          >
            Completed Date
          </label>
          <input
            className="flex-1 block w-full sm:text-sm border border-gray-300 rounded p-2"
            type="date"
            name="completedAt"
            id="completedAt"
            value={format(task.completedAt || new Date(), "yyyy-MM-dd")}
            onChange={updateDate}
          />
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
