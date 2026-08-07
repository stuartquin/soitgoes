import { format } from "date-fns";

import { TrackedTime, Project } from "apiv3";
import { getDate } from "lib/date";
import IconPlay from "components/Icons/IconPlay";
import IconStop from "components/Icons/IconStop";

interface Props {
  trackedTime: TrackedTime;
  project?: Project;
  isActive: boolean;
  isPending: boolean;
  onStart: (trackedTime: TrackedTime) => void;
  onStop: (trackedTime: TrackedTime) => void;
}

function formatDuration(duration: number | string | null | undefined): string {
  if (duration === null || duration === undefined) {
    return "—";
  }
  const seconds = Math.floor(Number(duration));
  if (Number.isNaN(seconds)) {
    return "—";
  }
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return hours > 0 ? `${hours}:${mm}:${ss}` : `${minutes}:${ss}`;
}

function TrackedTimeRow({
  trackedTime,
  project,
  isActive,
  isPending,
  onStart,
  onStop,
}: Props) {
  const startedAt = getDate(trackedTime.started_at);
  const endedAt = trackedTime.ended_at ? getDate(trackedTime.ended_at) : null;

  const handleClick = () => {
    if (isActive) {
      onStop(trackedTime);
    } else {
      onStart(trackedTime);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-3 px-4 hover:bg-blue-50">
      <div className="flex-grow min-w-0">
        <div className="text-gray-800 text-sm md:text-base font-medium truncate">
          {project?.name ?? `Project #${trackedTime.project}`}
        </div>
        {trackedTime.comment && (
          <div className="text-gray-500 text-sm truncate">
            {trackedTime.comment}
          </div>
        )}
        <div className="text-gray-400 text-xs mt-1">
          {format(startedAt, "yyyy-MM-dd HH:mm:ss")}
          {endedAt ? ` → ${format(endedAt, "HH:mm:ss")}` : " → running"}
        </div>
      </div>
      <div className="flex items-center ml-4">
        {isActive && (
          <span className="mr-3 inline-flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </span>
        )}
        <div className="text-right mr-4">
          <div className="text-gray-800 text-sm md:text-base font-mono">
            {formatDuration(trackedTime.duration)}
          </div>
          <div className="text-gray-400 text-xs capitalize">
            {isActive ? "tracking" : "complete"}
          </div>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={isPending}
          title={isActive ? "Stop tracking" : "Start tracking"}
          aria-label={isActive ? "Stop tracking" : "Start tracking"}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            isActive
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {isActive ? (
            <IconStop className="h-4 w-4" />
          ) : (
            <IconPlay className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

export default TrackedTimeRow;