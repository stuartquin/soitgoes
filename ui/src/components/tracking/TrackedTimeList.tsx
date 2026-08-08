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
import { formatQuery, getDate } from "lib/date";
import SlideOver from "components/SlideOver";
import TrackedTimeRow from "components/tracking/TrackedTimeRow";
import TrackingSummaryPanel from "components/tracking/TrackingSummaryPanel";
import TrackingReport from "components/tracking/TrackingReport";
import DateFilterPopover from "components/tracking/DateFilterPopover";
import StartTrackingPopover from "components/tracking/StartTrackingPopover";

export interface TrackingFilters {
  project?: number;
  start?: Date;
  end?: Date;
}

interface Props {
  trackedTimes: TrackedTime[];
  projects: Project[];
  tasks: Task[];
  filters: TrackingFilters;
}

function isRowOpen(tt: TrackedTime): boolean {
  return !tt.ended_at;
}

function TrackedTimeList({ trackedTimes, projects, tasks, filters }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [reportOpen, setReportOpen] = useState(false);

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

  // Start a brand-new tracking session for the chosen project, closing any
  // in-progress row for that project first (one open session per project).
  const handleStartProject = useCallback(
    (project: Project) => {
      startMutation.mutate({
        trackedTime: {
          project: project.id as number,
          task: project.default_task ?? null,
          started_at: "",
        },
        openToClose: openByProject.get(project.id as number),
        started_at: new Date().toISOString(),
      });
    },
    [openByProject, startMutation]
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

  const navigate = useNavigate();
  const handleEdit = useCallback(
    (trackedTime: TrackedTime) => {
      navigate({
        to: "/tracking/$trackingId",
        params: { trackingId: String(trackedTime.id) },
      });
    },
    [navigate]
  );

  const handleProjectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value ? Number(e.target.value) : undefined;
      navigate({
        to: "/tracking",
        search: (prev) => ({ ...prev, project: value }),
      });
    },
    [navigate]
  );

  const handlePresetApply = useCallback(
    ({ start: newStart, end: newEnd }: { start?: string; end?: string }) => {
      navigate({
        to: "/tracking",
        search: (prev) => ({ ...prev, start: newStart, end: newEnd }),
      });
    },
    [navigate]
  );

  const reportFilters = useMemo(() => {
    const projectName = filters.project
      ? projects.find((p) => p.id === filters.project)?.name ??
        `Project ${filters.project}`
      : "All projects";
    if (filters.start && filters.end) {
      return {
        projectName,
        dateRange: `${formatQuery(filters.start)} to ${formatQuery(
          filters.end
        )}`,
      };
    }
    if (filters.start) {
      return { projectName, dateRange: `from ${formatQuery(filters.start)}` };
    }
    if (filters.end) {
      return { projectName, dateRange: `up to ${formatQuery(filters.end)}` };
    }
    return { projectName, dateRange: "all time" };
  }, [filters.project, filters.start, filters.end, projects]);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2 my-4 w-full px-2 sm:px-0">
      <div className="flex gap-2 items-center">
        <select
          className="select"
          value={filters.project ?? ""}
          onChange={handleProjectChange}
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <DateFilterPopover
          start={filters.start ? formatQuery(filters.start) : undefined}
          end={filters.end ? formatQuery(filters.end) : undefined}
          onChange={handlePresetApply}
        />
        <button
          type="button"
          onClick={() => setReportOpen(true)}
          className="h-8 px-2 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 text-sm transition-colors hover:bg-gray-100"
          title="View report"
        >
          View Report
        </button>
      </div>
      <StartTrackingPopover
        projects={projects}
        trackedTimes={trackedTimes}
        onSelect={handleStartProject}
        disabled={startMutation.isPending}
      />
    </div>
  );

  const renderReport = (
    <SlideOver
      isOpen={reportOpen}
      onClose={() => setReportOpen(false)}
      className="report-slideover"
    >
      <TrackingReport
        trackedTimes={trackedTimes}
        projects={projects}
        tasks={tasks}
        filters={reportFilters}
      />
    </SlideOver>
  );

  if (!groupedDays.length) {
    return (
      <div className="w-full">
        {header}
        <div className="text-gray-500 text-center py-12">
          No tracked time yet.
        </div>
        {renderReport}
      </div>
    );
  }

  return (
    <div className="w-full">
      {header}
      <div className="px-2 sm:px-0 flex flex-col lg:flex-row lg:gap-4">
        <div className="space-y-6 lg:w-2/3">
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
                    {entries.length}{" "}
                    {entries.length === 1 ? "entry" : "entries"}
                  </span>
                </div>
                {entries.map((trackedTime) => (
                  <TrackedTimeRow
                    key={trackedTime.id}
                    trackedTime={trackedTime}
                    project={projectLookup.get(trackedTime.project)}
                    isActive={isRowOpen(trackedTime)}
                    isPending={
                      startMutation.isPending || stopMutation.isPending
                    }
                    onStart={handleStart}
                    onStop={handleStop}
                    onEdit={() => handleEdit(trackedTime)}
                  />
                ))}
              </div>
            );
          })}
        </div>
        <div className="my-4 lg:w-1/3 space-y-4 hidden lg:block">
          <TrackingSummaryPanel trackedTimes={trackedTimes} />
        </div>
      </div>
      {renderReport}
    </div>
  );
}

export default TrackedTimeList;
