import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import { TrackedTime, Project, Task, createTrackedTime, partialUpdateTrackedTime } from "apiv3";
import SlideOver from "components/SlideOver";
import Button from "components/Button";
import TrackedTimeForm, { TrackedTimeDraft } from "components/tracking/TrackedTimeForm";

interface Props {
  isOpen: boolean;
  trackedTime: TrackedTime | null;
  projects: Project[];
  tasks: Task[];
  onClose: () => void;
  onSaved: () => void;
}

function toDraft(tt: TrackedTime | null): TrackedTimeDraft {
  if (!tt) return {};
  return {
    id: tt.id,
    project: tt.project,
    task: tt.task ?? null,
    started_at: tt.started_at,
    ended_at: tt.ended_at,
    comment: tt.comment,
  };
}

export interface EditorPanelProps {
  trackedTime: TrackedTime | null;
  projects: Project[];
  tasks: Task[];
  onSaved: () => void;
  onClose: () => void;
}

export function TrackedTimeEditorPanel({
  trackedTime,
  projects,
  tasks,
  onSaved,
  onClose,
}: EditorPanelProps) {
  const [draft, setDraft] = useState<TrackedTimeDraft>(() => toDraft(trackedTime));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-seed the draft whenever the target entry changes (e.g. navigating
  // between detail routes).
  useEffect(() => {
    setDraft(toDraft(trackedTime));
    setError(null);
  }, [trackedTime]);

  const isEdit = draft.id != null;
  const projectValid = draft.project != null;

  const handleSave = useCallback(async () => {
    if (!projectValid) {
      setError("Project is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const project = draft.project as number;
      // Start At is optional in the UI: default to now on create, or keep
      // the existing value on edit. End At left blank means in-progress.
      const started_at =
        draft.started_at || (isEdit ? "" : new Date().toISOString());
      if (!started_at) {
        setError("Start At is required");
        setSaving(false);
        return;
      }

      const body = {
        project,
        task: draft.task ?? null,
        started_at,
        ended_at: draft.ended_at ?? null,
        comment: draft.comment ?? null,
      };

      if (isEdit) {
        await partialUpdateTrackedTime({ path: { id: String(draft.id) }, body });
      } else {
        await createTrackedTime({ body });
      }
      onSaved();
      onClose();
    } catch (e) {
      setError("Failed to save tracked time");
    } finally {
      setSaving(false);
    }
  }, [draft, isEdit, projectValid, onSaved, onClose]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-800 text-lg font-medium">
          {isEdit ? "Edit Tracked Time" : "New Tracked Time"}
        </div>
        <Button
          variant="success"
          onClick={handleSave}
          disabled={saving || !projectValid}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
          {error}
        </div>
      )}

      <TrackedTimeForm
        draft={draft}
        projects={projects}
        tasks={tasks}
        onUpdate={setDraft}
      />
    </div>
  );
}

function TrackedTimeEditor({
  isOpen,
  trackedTime,
  projects,
  tasks,
  onClose,
  onSaved,
}: Props) {
  return (
    <SlideOver isOpen={isOpen} onClose={onClose}>
      <TrackedTimeEditorPanel
        trackedTime={trackedTime}
        projects={projects}
        tasks={tasks}
        onSaved={onSaved}
        onClose={onClose}
      />
    </SlideOver>
  );
}

export default TrackedTimeEditor;
