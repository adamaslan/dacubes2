import { useEffect, useState } from "react";

export type ThemeName = "cyber" | "posh";

const read = (): ThemeName =>
  typeof document !== "undefined" &&
  document.documentElement.getAttribute("data-theme") === "posh"
    ? "posh"
    : "cyber";

/**
 * Reads the site-wide data-theme attribute set by ThemeToggle, so R3F
 * scenes can react to it (desaturate materials, lower bloom/emissive in
 * posh mode). Without this hook the canvases stay neon while the rest of
 * the page goes ivory — the single most likely way the toggle ships
 * looking broken.
 */
export function useTheme(): ThemeName {
  // Lazy initializer runs synchronously on first client render (root.tsx's
  // inline script has already stamped data-theme by then), so the first
  // TextAnimation paint gets the persisted theme's colors instead of a
  // flash of cyber before the effect below catches up.
  const [theme, setTheme] = useState<ThemeName>(read);

  useEffect(() => {
    setTheme(read());

    const observer = new MutationObserver(() => setTheme(read()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
