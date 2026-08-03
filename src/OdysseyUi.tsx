import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return <button type={type} className={`odyssey-button ${variant} ${className}`.trim()} {...props} />;
}

type BadgeTone = "neutral" | "success" | "reward";

export function Badge({ children, tone = "neutral", className = "" }: { children: ReactNode; tone?: BadgeTone; className?: string }) {
  return <span className={`odyssey-badge ${tone} ${className}`.trim()}>{children}</span>;
}

export function ScoreTicker({ value, from, label }: { value: number; from?: number; label?: string }) {
  const previousValue = useRef(from ?? value);
  const start = from ?? previousValue.current;
  const changed = start !== value;

  useEffect(() => {
    previousValue.current = value;
  }, [value]);

  return (
    <span className="score-ticker-shell">
      <span className="sr-only">{label ?? `${value} points`}</span>
      <strong className="score-tick" aria-hidden="true">
        <span key={`${start}-${value}`} className={`score-reel${changed ? " is-changing" : ""}`}>
          {changed && <span>{start}</span>}
          <span>{value}</span>
        </span>
      </strong>
    </span>
  );
}

function prefersReducedMotion() {
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function AnimatedCount({ value, delay = 0, label }: { value: number; delay?: number; label: string }) {
  const reducedMotion = prefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (reducedMotion || value === 0) {
      setDisplayValue(value);
      return;
    }

    let frame = 0;
    let startedAt = 0;
    const timer = window.setTimeout(() => {
      const tick = (timestamp: number) => {
        if (!startedAt) startedAt = timestamp;
        const progress = Math.min((timestamp - startedAt) / 600, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(value * eased));
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(frame);
    };
  }, [delay, reducedMotion, value]);

  return (
    <span className="animated-count" aria-label={label}>
      <span className="animated-count-value" aria-hidden="true" style={{ animationDelay: `${delay}ms` }}>{displayValue}</span>
    </span>
  );
}

export function PanelTransition({ phase, contentKey, children }: { phase: string; contentKey: string; children: ReactNode }) {
  return <div key={contentKey} className="panel-transition" data-phase={phase}>{children}</div>;
}
