import { useEffect, useRef, useState, type ReactNode } from "react";
import { knowledgeSparkAnimation } from "./delightAnimations";

function useReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia?.(query).matches === true);

  useEffect(() => {
    const media = window.matchMedia?.(query);
    if (!media) return;
    const update = () => setReduced(media.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

export function KnowledgeSpark({ className = "", delay = 120, fallback }: { className?: string; delay?: number; fallback: ReactNode }) {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // jsdom has no canvas implementation for Lottie's feature detection.
    if (reducedMotion || import.meta.env.MODE === "test" || !containerRef.current) return;
    let cancelled = false;
    let destroy: () => void = () => undefined;
    let timer = 0;

    timer = window.setTimeout(() => {
      void import("lottie-web/build/player/lottie_light").then(({ default: lottie }) => {
        if (cancelled || !containerRef.current) return;
        const animation = lottie.loadAnimation({
          animationData: knowledgeSparkAnimation,
          autoplay: true,
          container: containerRef.current,
          loop: false,
          renderer: "svg",
          rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
        });
        destroy = () => animation.destroy();
      });
    }, delay);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      destroy();
    };
  }, [delay, reducedMotion]);

  if (reducedMotion) return <span className={`knowledge-spark-fallback ${className}`.trim()}>{fallback}</span>;

  return (
    <span aria-hidden="true" className={`knowledge-spark ${className}`.trim()}>
      <span className="knowledge-spark-poster" style={{ animationDelay: `${delay}ms` }}>{fallback}</span>
      <span ref={containerRef} className="lottie-host" />
    </span>
  );
}
