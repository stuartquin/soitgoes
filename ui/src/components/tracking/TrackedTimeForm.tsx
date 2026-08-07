import React, { useCallback, useMemo } from "react";

import { TrackedTime, Project, Task } from "apiv3";
import Label from "components/Form/Label";
import Select from "components/Form/Select";
import Input from "components/Form/Input";
import Textarea from "components/Form/Textarea";
import { toDatetimeLocal, fromDatetimeLocal } from "lib/date";

export interface TrackedTimeDraft {
  id?: number;
  project?: number;
  task?: number | null;
  started_at?: string | null;
  ended_at?: string | null;
  comment?: string | null;
}

interface Props {
  draft: TrackedTimeDraft;
  projects: Project[];
  tasks: Task[];
  onUpdate: (draft: TrackedTimeDraft) => void;
}

function TrackedTimeForm({ draft, projects, tasks, onUpdate }: Props) {
  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project === draft.project),
    [tasks, draft.project]
  );

  const updateField = useCallback(
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const target = event.target as HTMLInputElement;
      const { name, value } = target;
      onUpdate({ ...draft, [name]: value });
    },
    [draft, onUpdate]
  );

  const updateTaskField = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { value } = event.target;
      onUpdate({ ...draft, task: value ? Number(value) : null });
    },
    [draft, onUpdate]
  );

  const updateDatetime = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      onUpdate({ ...draft, [name]: fromDatetimeLocal(value) });
    },
    [draft, onUpdate]
  );

  return (
    <form
      action="#"
      method="POST"
      className="w-full grid grid-cols-1 gap-4"
      onSubmit={(e) => e.preventDefault()}
    >
      <div>
        <Label htmlFor="project">Project *</Label>
        <Select
          className="w-full"
          name="project"
          id="project"
          value={draft.project ?? ""}
          onChange={updateField}
        >
          <option value="" disabled>
            Select a project
          </option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="task">Task</Label>
        <Select
          className="w-full"
          name="task"
          id="task"
          value={draft.task ?? ""}
          onChange={updateTaskField}
          disabled={!draft.project}
        >
          <option value="">None</option>
          {projectTasks.map((task) => (
            <option key={task.id} value={task.id}>
              {task.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="started_at">Start At</Label>
          <Input
            type="datetime-local"
            name="started_at"
            id="started_at"
            value={toDatetimeLocal(draft.started_at)}
            onChange={updateDatetime}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="ended_at">End At</Label>
          <Input
            type="datetime-local"
            name="ended_at"
            id="ended_at"
            value={toDatetimeLocal(draft.ended_at)}
            onChange={updateDatetime}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          name="comment"
          id="comment"
          value={draft.comment ?? ""}
          onChange={updateField}
          className="w-full"
        />
      </div>
    </form>
  );
}

export default TrackedTimeForm;