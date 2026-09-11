import { useEffect, useRef, useState } from "react";
import { useTheme } from "../hooks/useTheme";

/**
 * Decorative parallax backdrop for the landing route. Sits behind
 * `.page-container`'s content (z-index: 0) and above the flat `--page-bg`.
 *
 * - Fun register: blurred `--accent` / `--accent-2` blobs + a faint dot-grid +
 *   sparse streaks. The blobs double as the "more colour in the dark" from
 *   datodo2 §1 — they read the CSS accent tokens, so flipping the theme toggle
 *   re-tints them for free.
 * - Posh register: a single, barely-there warm-grey layer — parallax blobs
 *   fight the elegant register, so almost everything is dropped.
 * - `prefers-reduced-motion: reduce`: layers render static. No rAF loop, no
 *   pointer listener. Non-negotiable — parallax is the classic offender.
 *
 * Perf: three plain DOM nodes, CSS transforms only (composite, never layout),
 * `will-change: transform` on the moving layers only. The landing route
 * already mounts several R3F canvases, so this stays deliberately cheap.
 */
export default function ParallaxBackground() {
  const theme = useTheme();

  // useTheme()'s lazy initializer reads document.documentElement on the first
  // client render, so on a saved-Posh load it returns "posh" while the SSR
  // markup was built as "cyber". Gate the theme branch behind a mount flag so
  // the first client render matches the server (the 3-layer Fun markup), then
  // switch to the real register after mount — no hydration subtree swap.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const isPosh = hydrated && theme === "posh";

  const farRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const nearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPosh) return; // Posh renders one static layer — nothing to animate

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return; // static — no loop, no listeners

    // [element, scroll factor (0.1–0.4), pointer travel in px]
    const layers: Array<[HTMLDivElement | null, number, number]> = [
      [farRef.current, 0.12, 8],
      [midRef.current, 0.26, 16],
      [nearRef.current, 0.4, 28],
    ];

    const wantsPointer = window.matchMedia("(pointer: fine)").matches;
    const pointerTarget = { x: 0, y: 0 }; // -1..1
    const pointerNow = { x: 0, y: 0 }; // lerped

    let raf = 0;
    let running = true;

    /** One rAF tick: lerp the pointer, then write each layer's transform. */
    const frame = () => {
      if (!running) return;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      pointerNow.x += (pointerTarget.x - pointerNow.x) * 0.06;
      pointerNow.y += (pointerTarget.y - pointerNow.y) * 0.06;

      // Each layer bleeds 15% past the viewport; keep the combined scroll +
      // pointer travel inside that bleed so no layer edge scrolls into view
      // on a long page.
      const maxTy = window.innerHeight * 0.15;

      for (const [el, scrollFactor, travel] of layers) {
        if (!el) continue;
        const tx = pointerNow.x * travel;
        const rawTy = -scrollY * scrollFactor + pointerNow.y * travel;
        const ty = Math.max(-maxTy, Math.min(maxTy, rawTy));
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };

    /** Store the latest pointer position as a -1..1 offset from viewport centre. */
    const onPointerMove = (e: PointerEvent) => {
      pointerTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    if (wantsPointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      if (wantsPointer) window.removeEventListener("pointermove", onPointerMove);
    };
  }, [isPosh]);

  const container: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    pointerEvents: "none",
    overflow: "hidden",
  };

  // Bleed past the viewport so scroll/pointer translation never reveals an edge.
  const layerBase: React.CSSProperties = {
    position: "absolute",
    inset: "-15%",
    willChange: "transform",
  };

  if (isPosh) {
    return (
      <div style={container} aria-hidden="true">
        <div
          style={{
            ...layerBase,
            background:
              "radial-gradient(50% 50% at 50% 30%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      </div>
    );
  }

  return (
    <div style={container} aria-hidden="true">
      {/* far: blurred two-tone blobs — the "colour in the dark" */}
      <div
        ref={farRef}
        style={{
          ...layerBase,
          background:
            "radial-gradient(42% 42% at 18% 24%, color-mix(in srgb, var(--accent) 24%, transparent), transparent 70%), " +
            "radial-gradient(46% 46% at 84% 68%, color-mix(in srgb, var(--accent-2) 22%, transparent), transparent 72%)",
          filter: "blur(72px)",
        }}
      />
      {/* mid: faint dot-grid */}
      <div
        ref={midRef}
        style={{
          ...layerBase,
          backgroundImage:
            "radial-gradient(color-mix(in srgb, var(--accent) 12%, transparent) 1px, transparent 1.6px)",
          backgroundSize: "46px 46px",
          opacity: 0.5,
        }}
      />
      {/* near: a few sparse streaks / sparks */}
      <div
        ref={nearRef}
        style={{
          ...layerBase,
          background:
            "radial-gradient(2px 2px at 15% 62%, color-mix(in srgb, var(--accent-2) 60%, transparent), transparent), " +
            "radial-gradient(2px 2px at 72% 20%, color-mix(in srgb, var(--accent) 55%, transparent), transparent), " +
            "radial-gradient(1.5px 1.5px at 88% 82%, color-mix(in srgb, var(--accent-2) 50%, transparent), transparent), " +
            "radial-gradient(1.5px 1.5px at 40% 88%, color-mix(in srgb, var(--accent) 45%, transparent), transparent)",
          opacity: 0.55,
        }}
      />
    </div>
  );
}
