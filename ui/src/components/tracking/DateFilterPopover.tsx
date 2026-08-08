import { useCallback, useEffect, useRef, useState } from "react";

import {
  getStartOfWeek,
  getEndOfWeek,
  getStartOfMonth,
  getEndOfMonth,
  formatQuery,
} from "lib/date";
import { addMonths } from "date-fns";
import IconCalendar from "components/Icons/IconCalendar";

interface Props {
  /** Currently active `start` query value (yyyy-MM-dd), if any. */
  start?: string;
  /** Currently active `end` query value (yyyy-MM-dd), if any. */
  end?: string;
  /**
   * Called whenever the date range changes — either via a preset or by
   * editing the start/end inputs. Unset values are passed as `undefined`.
   */
  onChange: (range: { start?: string; end?: string }) => void;
}

interface Preset {
  label: string;
  range: () => { start: string; end: string };
}

const PRESETS: Preset[] = [
  {
    label: "This Week",
    range: () => {
      const now = new Date();
      return {
        start: formatQuery(getStartOfWeek(now)),
        end: formatQuery(getEndOfWeek(now)),
      };
    },
  },
  {
    label: "This Month",
    range: () => {
      const now = new Date();
      return {
        start: formatQuery(getStartOfMonth(now)),
        end: formatQuery(getEndOfMonth(now)),
      };
    },
  },
  {
    label: "Last Month",
    range: () => {
      const lastMonth = addMonths(new Date(), -1);
      return {
        start: formatQuery(getStartOfMonth(lastMonth)),
        end: formatQuery(getEndOfMonth(lastMonth)),
      };
    },
  },
];

function isSameRange(
  a: { start?: string; end?: string },
  b: { start?: string; end?: string }
): boolean {
  return a.start === b.start && a.end === b.end;
}

function DateFilterPopover({ start, end, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handlePreset = useCallback(
    (preset: Preset) => {
      onChange(preset.range());
      setOpen(false);
    },
    [onChange]
  );

  const handleStartChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value || undefined;
      onChange({ start: value, end });
    },
    [end, onChange]
  );

  const handleEndChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value || undefined;
      onChange({ start, end: value });
    },
    [start, onChange]
  );

  const activeRange = { start, end };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="h-8 w-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100"
        title="Date range filter"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <IconCalendar className="h-5 w-5" />
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute right-0 top-full mt-1 z-20 w-56 rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Presets
          </div>
          <ul className="py-1">
            {PRESETS.map((preset) => {
              const range = preset.range();
              const isActive = isSameRange(activeRange, range);
              return (
                <li key={preset.label}>
                  <button
                    type="button"
                    onClick={() => handlePreset(preset)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>{preset.label}</span>
                    {isActive && <span className="text-blue-500">✓</span>}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-gray-200 px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Custom range
          </div>
          <div className="px-3 pb-3 pt-1 space-y-2">
            <label className="block">
              <span className="text-xs text-gray-500">Start</span>
              <input
                type="date"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={start ?? ""}
                onChange={handleStartChange}
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-500">End</span>
              <input
                type="date"
                className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
                value={end ?? ""}
                onChange={handleEndChange}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}

export default DateFilterPopover;
