import { useEffect } from "react";

export function useAutoSave(
  data: any,
  onSave: (data: any) => void,
  delay: number = 5000,
) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onSave(data);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, onSave, delay]);
}
