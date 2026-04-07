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
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) return;
    const timer = setTimeout(() => {
      onSaveRef.current(data);
    }, delay);
    return () => clearTimeout(timer);
  }, [data, delay, enabled]);
}
