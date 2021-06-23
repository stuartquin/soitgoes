import React, { useCallback } from "react";
import { format } from "date-fns";

import Label from "components/Form/Label";
import Input from "components/Form/Input";
import Select from "components/Form/Select";
import * as models from "api/models";

interface Props {
  task: models.Task;
  projects: models.Project[];
  onUpdate?: (task: models.Task) => void;
}

function TaskForm({ task, projects, onUpdate }: Props) {
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
      onUpdate && onUpdate({ ...task, [name]: value ? new Date(value) : null });
    },
    [task, onUpdate]
  );

  const isBillingTypeDisabled = Boolean(task.id);

  return (
    <form
      action="#"
      method="POST"
      className="w-full sm:w-auto grid sm:grid-cols-3 gap-4"
    >
      <div className="grid col-span-2 grid-rows-2 sm:grid-rows-3 grid-cols-3 gap-4">
        <div className="col-span-3">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            value={task.name || ""}
            onChange={updateTask}
            id="name"
            className="w-full"
          />
        </div>

        <div className="">
          <Label htmlFor="billingType">Project</Label>
          <Select
            className="w-full"
            name="project"
            id="project"
            value={task.project}
            onChange={updateTask}
            disabled={isBillingTypeDisabled}
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="">
          <Label htmlFor="billingType">Billing Type</Label>
          <Select
            className="w-full"
            name="billingType"
            id="billingType"
            value={task.billingType}
            onChange={updateTask}
            disabled={isBillingTypeDisabled}
          >
            {Object.values(models.TaskBillingTypeEnum).map((billingType) => (
              <option key={billingType} value={billingType}>
                {billingType}
              </option>
            ))}
          </Select>
        </div>
        {task.billingType === models.TaskBillingTypeEnum.Fixed && (
          <div className="">
            <Label htmlFor="cost">Cost</Label>
            <Input
              type="text"
              name="cost"
              value={task.cost || ""}
              onChange={updateTask}
              id="cost"
              className="w-full"
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 col-span-2 sm:col-span-1">
        <div className="">
          <Label htmlFor="state">State</Label>
          <Select
            className="w-full"
            name="state"
            id="state"
            value={task.state}
            onChange={updateTask}
          >
            {Object.values(models.TaskStateEnum).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </Select>
        </div>
        <div className="">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            type="date"
            name="dueDate"
            id="dueDate"
            value={task.dueDate ? format(task.dueDate, "yyyy-MM-dd") : ""}
            onChange={updateDate}
            className="w-full"
          />
        </div>
        <div className="">
          <Label htmlFor="completedAt">Completed Date</Label>
          <Input
            type="date"
            name="completedAt"
            id="completedAt"
            value={
              task.completedAt ? format(task.completedAt, "yyyy-MM-dd") : ""
            }
            onChange={updateDate}
            className="w-full"
          />
        </div>
      </div>
    </form>
  );
}

export default TaskForm;
