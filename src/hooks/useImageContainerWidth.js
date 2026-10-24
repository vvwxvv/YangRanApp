import { useRef, useState, useEffect } from "react";

/**
 * Tracks the rendered pixel-width of the first <img> or <video>
 * inside the returned ref's container (falls back to the container itself).
 */
const useImageContainerWidth = (dependency) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const media = el.querySelector("img, video");
      const rect = (media || el).getBoundingClientRect();
      setWidth(rect.width);
    };

    // Allow layout to settle
    const timer = setTimeout(measure, 100);

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    const img = el.querySelector("img");
    if (img) img.addEventListener("load", measure);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      if (img) img.removeEventListener("load", measure);
    };
  }, [dependency]);

  return { containerRef, width };
};

export default useImageContainerWidth;