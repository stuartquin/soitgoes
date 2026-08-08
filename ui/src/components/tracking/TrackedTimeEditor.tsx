import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

import {
  TrackedTime,
  Project,
  Task,
  createTrackedTime,
  partialUpdateTrackedTime,
  destroyTrackedTime,
} from "apiv3";
import { TrashIcon } from "@heroicons/react/outline";
import SlideOver from "components/SlideOver";
import Button from "components/Button";
import TrackedTimeForm, {
  TrackedTimeDraft,
} from "components/tracking/TrackedTimeForm";

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
  const [draft, setDraft] = useState<TrackedTimeDraft>(() =>
    toDraft(trackedTime)
  );
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
        await partialUpdateTrackedTime({
          path: { id: String(draft.id) },
          body,
        });
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

  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (!isEdit || draft.id == null) return;
    if (
      !window.confirm("Delete this tracked time entry? This cannot be undone.")
    ) {
      return;
    }
    setDeleting(true);
    setError(null);
    try {
      await destroyTrackedTime({ path: { id: String(draft.id) } });
      onSaved();
      onClose();
    } catch (e) {
      setError("Failed to delete tracked time");
    } finally {
      setDeleting(false);
    }
  }, [draft.id, isEdit, onSaved, onClose]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-800 text-lg font-medium">
          {isEdit ? "Edit Tracked Time" : "New Tracked Time"}
        </div>
        <div className="flex items-center gap-2">
          {isEdit && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="h-8 w-8 flex items-center justify-center rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-red-500 hover:bg-red-600"
              title="Delete tracked time"
            >
              <TrashIcon className="h-6 w-6" />
            </button>
          )}
          <Button
            variant="success"
            onClick={handleSave}
            disabled={saving || !projectValid}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
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
