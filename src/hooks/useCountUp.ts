import { useState, useEffect, useRef } from "react";

/**
 * Animates a number from its previous value to `target` over `duration` ms.
 * Uses an ease-out cubic curve for a polished feel.
 */
export function useCountUp(target: number, duration = 700): number {
  const [count, setCount] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    if (start === target) {
      setCount(target);
      return;
    }
    prevRef.current = target;

    const diff = target - start;
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}
