import { useCallback, useMemo, useState } from "react";
import { format, isToday } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useNavigate } from "@tanstack/react-router";

import {
  TrackedTime,
  Project,
  Task,
  createTrackedTime,
  partialUpdateTrackedTime,
} from "apiv3";
import { getDate } from "lib/date";
import Button from "components/Button";
import IconPlus from "components/Icons/IconPlus";
import TrackedTimeRow from "components/tracking/TrackedTimeRow";
import TrackedTimeEditor from "components/tracking/TrackedTimeEditor";
import IconPlay from "components/Icons/IconPlay";

interface Props {
  trackedTimes: TrackedTime[];
  projects: Project[];
  tasks: Task[];
}

function isRowOpen(tt: TrackedTime): boolean {
  return !tt.ended_at;
}

function TrackedTimeList({ trackedTimes, projects, tasks }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorTarget, setEditorTarget] = useState<TrackedTime | null>(null);

  const projectLookup = useMemo(() => {
    const map = new Map<number, Project>();
    projects.forEach((p) => {
      if (p.id !== undefined) {
        map.set(p.id, p);
      }
    });
    return map;
  }, [projects]);

  // The single in-progress TrackedTime per project (if any). A project can
  // only have one open tracking session at a time.
  const openByProject = useMemo(() => {
    const map = new Map<number, TrackedTime>();
    trackedTimes.forEach((tt) => {
      if (isRowOpen(tt)) {
        map.set(tt.project, tt);
      }
    });
    return map;
  }, [trackedTimes]);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [{ _id: "listTrackedTimes" }] });
    router.invalidate();
  }, [queryClient, router]);

  const stopMutation = useMutation({
    mutationFn: ({
      trackedTime,
      ended_at,
    }: {
      trackedTime: TrackedTime;
      ended_at: string;
    }) =>
      partialUpdateTrackedTime({
        path: { id: String(trackedTime.id) },
        body: {
          project: trackedTime.project,
          task: trackedTime.task ?? null,
          started_at: trackedTime.started_at,
          ended_at,
        },
      }),
    onSuccess: refresh,
  });

  const startMutation = useMutation({
    mutationFn: async ({
      trackedTime,
      openToClose,
      started_at,
    }: {
      trackedTime: TrackedTime;
      openToClose?: TrackedTime;
      started_at: string;
    }) => {
      // Enforce one in-progress row per project: close the existing open
      // TrackedTime for this project (if any) before starting a new one.
      if (openToClose) {
        await partialUpdateTrackedTime({
          path: { id: String(openToClose.id) },
          body: {
            project: openToClose.project,
            task: openToClose.task ?? null,
            started_at: openToClose.started_at,
            ended_at: started_at,
          },
        });
      }
      return createTrackedTime({
        body: {
          project: trackedTime.project,
          task: trackedTime.task ?? null,
          started_at,
        },
      });
    },
    onSuccess: refresh,
  });

  const handleStart = useCallback(
    (trackedTime: TrackedTime) => {
      startMutation.mutate({
        trackedTime,
        openToClose: openByProject.get(trackedTime.project),
        started_at: new Date().toISOString(),
      });
    },
    [openByProject, startMutation]
  );

  const handleStop = useCallback(
    (trackedTime: TrackedTime) => {
      stopMutation.mutate({
        trackedTime,
        ended_at: new Date().toISOString(),
      });
    },
    [stopMutation]
  );

  // Group TrackedTime entries by the day of their `started_at`, then render
  // each day group (most recent day first) with a day header. Within a day,
  // in-progress rows sort first, then by `started_at` DESC.
  const groupedDays = useMemo(() => {
    const byDay = new Map<string, TrackedTime[]>();
    trackedTimes.forEach((tt) => {
      const dayKey = format(getDate(tt.started_at), "yyyy-MM-dd");
      const bucket = byDay.get(dayKey);
      if (bucket) {
        bucket.push(tt);
      } else {
        byDay.set(dayKey, [tt]);
      }
    });

    return [...byDay.entries()]
      .sort(([dayA], [dayB]) => dayB.localeCompare(dayA))
      .map(([dayKey, entries]) => {
        const sortedEntries = entries.sort((a, b) => {
          const aOpen = isRowOpen(a);
          const bOpen = isRowOpen(b);
          if (aOpen !== bOpen) return aOpen ? -1 : 1;
          return (
            new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
          );
        });
        return { dayKey, entries: sortedEntries };
      });
  }, [trackedTimes]);

  const openEditor = useCallback((trackedTime: TrackedTime | null) => {
    setEditorTarget(trackedTime);
    setEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => setEditorOpen(false), []);

  const navigate = useNavigate();
  const handleEdit = useCallback(
    (trackedTime: TrackedTime) => {
      navigate({ to: "/tracking/$trackingId", params: { trackingId: String(trackedTime.id) } });
    },
    [navigate]
  );

  const renderEditor = (
    <TrackedTimeEditor
      isOpen={editorOpen}
      trackedTime={editorTarget}
      projects={projects}
      tasks={tasks}
      onClose={closeEditor}
      onSaved={refresh}
    />
  );

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2 my-4 w-full px-2 sm:px-0">
      <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
        Tracked Time
      </h1>
      <button
        type="button"
        onClick={() => openEditor(null)}
        className="h-8 w-8 flex items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600"
      >
        <IconPlay className="h-4 w-4" />
      </button>
    </div>
  );

  if (!groupedDays.length) {
    return (
      <div>
        {header}
        <div className="text-gray-500 text-center py-12">
          No tracked time yet.
        </div>
        {renderEditor}
      </div>
    );
  }

  return (
    <div>
      {header}
      <div className="space-y-6">
        {groupedDays.map(({ dayKey, entries }) => {
          const dayDate = getDate(dayKey);
          const dayLabel = isToday(dayDate)
            ? "Today"
            : format(dayDate, "EEEE, d MMMM yyyy");
          return (
            <div
              key={dayKey}
              className="bg-white rounded-md shadow-sm overflow-hidden"
            >
              <div className="bg-gray-100 flex justify-between items-center px-4 py-2 text-gray-700 text-sm font-semibold">
                <span>{dayLabel}</span>
                <span className="text-gray-400 text-xs font-normal uppercase tracking-wide">
                  {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </span>
              </div>
              {entries.map((trackedTime) => (
                <TrackedTimeRow
                  key={trackedTime.id}
                  trackedTime={trackedTime}
                  project={projectLookup.get(trackedTime.project)}
                  isActive={isRowOpen(trackedTime)}
                  isPending={startMutation.isPending || stopMutation.isPending}
                  onStart={handleStart}
                  onStop={handleStop}
                  onEdit={() => handleEdit(trackedTime)}
                />
              ))}
            </div>
          );
        })}
      </div>
      {renderEditor}
    </div>
  );
}

export default TrackedTimeList;
