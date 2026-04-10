import { useEffect, useRef } from "react";

interface AutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => void;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
                                 data,
                                 onSave,
                                 delay = 600,
                                 enabled = true,
                               }: AutoSaveOptions<T>) {
  // Keep onSave stable — never re-triggers the effect when the callback changes
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  // Serialize data so the effect only re-runs when values actually change,
  // not just because RHF watch() produced a new object reference each render
  const serialized = JSON.stringify(data);

  // Track the previous serialized value — skip the very first mount save
  const prevRef = useRef<string | null>(null);
  const isMountRef = useRef(true);

  useEffect(() => {
    // Skip auto-save if disabled
    if (!enabled) return;

    // Skip the initial mount — we don't want to save the moment the form loads
    if (isMountRef.current) {
      isMountRef.current = false;
      prevRef.current = serialized;
      return;
    }

    // Skip if data hasn't actually changed
    if (serialized === prevRef.current) return;

    prevRef.current = serialized;

    const timer = setTimeout(() => {
      onSaveRef.current(data);
    }, delay);

    return () => clearTimeout(timer);
  }, [serialized, delay, enabled]);
}