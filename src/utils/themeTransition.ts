import { flushSync } from "react-dom";

/**
 * Ultra-smooth Circle Spread theme transition (CationGate style) using native View Transitions API.
 * Animates an expanding circular reveal directly from the clicked toggle button across the entire viewport.
 */
export function toggleThemeWithTransition(
  triggerElement: HTMLElement | null,
  isCurrentlyDark: boolean,
  setIsDark: (val: boolean) => void,
  duration = 850
) {
  const nextIsDark = !isCurrentlyDark;

  const applyTheme = () => {
    if (nextIsDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("ppdb-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("ppdb-theme", "light");
    }
    setIsDark(nextIsDark);
  };

  // Fallback for browsers without View Transitions API or users with reduced motion preference
  if (
    typeof document === "undefined" ||
    !("startViewTransition" in document) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    applyTheme();
    return;
  }

  // Ensure override styles are present for butter-smooth circle spread
  let styleEl = document.getElementById("toggle-theme-vt-override") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "toggle-theme-vt-override";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = `
    ::view-transition-group(root) {
      animation-duration: ${duration}ms !important;
      animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1) !important;
    }
    ::view-transition-old(root),
    ::view-transition-new(root) {
      animation: none !important;
      mix-blend-mode: normal !important;
    }
    ::view-transition-old(root) {
      z-index: 1 !important;
    }
    ::view-transition-new(root) {
      z-index: 9999 !important;
      will-change: clip-path;
    }
  `;

  // Calculate origin coordinates from the center of the trigger button
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  if (triggerElement) {
    const rect = triggerElement.getBoundingClientRect();
    x = rect.left + rect.width / 2;
    y = rect.top + rect.height / 2;
  }

  // Exact radius to reach the furthest screen corner
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  const transition = (document as any).startViewTransition(() => {
    flushSync(() => {
      applyTheme();
    });
  });

  transition.ready
    .then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {
      // Transition cancelled or interrupted
    });
}
