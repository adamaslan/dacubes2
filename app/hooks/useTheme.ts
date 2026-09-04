import { useEffect, useState } from "react";

export type ThemeName = "cyber" | "posh";

/**
 * Reads the site-wide data-theme attribute set by ThemeToggle, so R3F
 * scenes can react to it (desaturate materials, lower bloom/emissive in
 * posh mode). Without this hook the canvases stay neon while the rest of
 * the page goes ivory — the single most likely way the toggle ships
 * looking broken.
 */
export function useTheme(): ThemeName {
  const [theme, setTheme] = useState<ThemeName>("cyber");

  useEffect(() => {
    const read = (): ThemeName =>
      document.documentElement.getAttribute("data-theme") === "posh"
        ? "posh"
        : "cyber";

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
