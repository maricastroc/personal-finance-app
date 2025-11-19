import { useEffect, useRef } from "react";

export function useOutsideAndEscape<T extends HTMLElement>({
  enabled = true,
  onEscape,
  onClickOutside,
}: {
  enabled?: boolean;
  onEscape?: () => void;
  onClickOutside?: () => void;
}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickOutside?.();
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onEscape?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [enabled, onEscape, onClickOutside]);

  return ref;
}
