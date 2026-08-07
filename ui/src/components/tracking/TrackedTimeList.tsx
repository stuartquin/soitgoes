import { useCallback, useMemo } from "react";
import { format, isToday } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";

import {
  TrackedTime,
  Project,
  createTrackedTime,
  partialUpdateTrackedTime,
} from "apiv3";
import { getDate } from "lib/date";
import TrackedTimeRow from "components/tracking/TrackedTimeRow";

interface Props {
  trackedTimes: TrackedTime[];
  projects: Project[];
}

function isRowOpen(tt: TrackedTime): boolean {
  return !tt.ended_at;
}

function TrackedTimeList({ trackedTimes, projects }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

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

  if (!groupedDays.length) {
    return (
      <div className="text-gray-500 text-center py-12">
        No tracked time yet.
      </div>
    );
  }

  return (
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
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default TrackedTimeList;
