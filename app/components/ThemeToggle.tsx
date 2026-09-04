import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-theme";

type Theme = "cyber" | "posh";

/**
 * Fixed, site-wide toggle between the two visual registers. The actual
 * token values live in app/styles/theme.css under [data-theme="posh"];
 * this component only ever sets/reads the attribute + localStorage.
 */
export default function ThemeToggle() {
  // Start "cyber" to match SSR output; root.tsx's inline script already
  // corrected the DOM attribute pre-hydration, so read it back on mount.
  const [theme, setTheme] = useState<Theme>("cyber");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "posh" ? "posh" : "cyber");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "posh" ? "cyber" : "posh";
    setTheme(next);
    if (next === "posh") {
      document.documentElement.setAttribute("data-theme", "posh");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* private mode / storage disabled — theme still applies for this load */
    }
  };

  // Label names the action, not the current state: from cyber, the button
  // offers to go "Elegant"; from posh, it offers to go back to "Fun" (the
  // original vivid style).
  const label = theme === "posh" ? "Fun" : "Elegant";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={theme === "posh"}
      onClick={toggle}
    >
      <span className="theme-toggle-dot" aria-hidden="true" />
      {label} mode
    </button>
  );
}
