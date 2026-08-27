import { useCallback, useEffect, useRef, useState } from "react";

import { DuplicateIcon } from "@heroicons/react/outline";
import { formatQuery, getDate } from "lib/date";

interface Props {
  /** Start timestamp of the entry; used to prefill the copy date. */
  startedAt?: string | null;
  /**
   * Called with the chosen `yyyy-MM-dd` date. Should reject on failure so
   * the popover can surface the error and stay open.
   */
  onCopy: (copyDate: string) => Promise<unknown>;
  /** Disable the trigger button (e.g. while a save is pending). */
  disabled?: boolean;
}

function CopyTrackedTimePopover({ startedAt, onCopy, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [copyDate, setCopyDate] = useState("");
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  // Default the copy date to the day the entry starts on, once on open.
  const handleToggle = useCallback(() => {
    setOpen((prev) => {
      if (!prev && !copyDate) {
        setCopyDate(startedAt ? formatQuery(getDate(startedAt)) : "");
      }
      return !prev;
    });
  }, [copyDate, startedAt]);

  const handleCopy = useCallback(async () => {
    if (!copyDate || copying) return;
    setCopying(true);
    setError(null);
    try {
      await onCopy(copyDate);
      setOpen(false);
    } catch (e) {
      setError("Failed to copy tracked time");
    } finally {
      setCopying(false);
    }
  }, [copyDate, copying, onCopy]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || copying}
        className="h-8 w-8 flex items-center justify-center rounded text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-gray-500 hover:bg-gray-600"
        title="Copy to another day"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <DuplicateIcon className="h-6 w-6" />
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute right-0 top-full mt-1 z-20 w-56 rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Copy to
          </div>
          <div className="px-3 pb-3">
            <input
              type="date"
              value={copyDate}
              onChange={(e) => setCopyDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button
              type="button"
              onClick={handleCopy}
              disabled={!copyDate || copying}
              className="mt-2 w-full inline-flex justify-center rounded-md border border-transparent px-2 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700"
            >
              {copying ? "Copying..." : "Copy"}
            </button>
            {error && (
              <div className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CopyTrackedTimePopover;
