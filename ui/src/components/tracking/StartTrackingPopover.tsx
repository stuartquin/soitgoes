import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Project, TrackedTime } from "apiv3";
import IconPlay from "components/Icons/IconPlay";

interface Props {
  projects: Project[];
  /** Tracked times currently in view; projects appearing here are sorted to the top of the list. */
  trackedTimes: TrackedTime[];
  /** Called when a project is chosen from the list. */
  onSelect: (project: Project) => void;
  /** Disable the trigger button (e.g. while a mutation is pending). */
  disabled?: boolean;
}

function StartTrackingPopover({ projects, trackedTimes, onSelect, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Projects appearing in the in-view tracked times are surfaced to the top
  // of the list so recently/actively tracked projects are quickest to reach.
  const sortedProjects = useMemo(() => {
    const activeIds = new Set<number>();
    trackedTimes.forEach((tt) => {
      if (tt.project != null) activeIds.add(tt.project);
    });
    const active: Project[] = [];
    const rest: Project[] = [];
    projects.forEach((p) => {
      if (p.id != null && activeIds.has(p.id)) {
        active.push(p);
      } else {
        rest.push(p);
      }
    });
    const byName = (a: Project, b: Project) => a.name.localeCompare(b.name);
    return [...active.sort(byName), ...rest.sort(byName)];
  }, [projects, trackedTimes]);

  // Dismiss on outside click / Escape.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const handleSelect = useCallback(
    (project: Project) => {
      onSelect(project);
      setOpen(false);
    },
    [onSelect]
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        disabled={disabled}
        className="h-8 w-8 flex items-center justify-center rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-green-500 hover:bg-green-600"
        title="Start tracking"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <IconPlay className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute right-0 top-full mt-1 z-20 w-56 rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Start tracking
          </div>
          {projects.length === 0 ? (
            <div className="px-3 py-3 text-sm text-gray-500">
              No projects available.
            </div>
          ) : (
            <ul className="py-1 overflow-y-auto max-h-72" role="listbox">
              {sortedProjects.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(p)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default StartTrackingPopover;
