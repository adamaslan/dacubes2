import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./styles/global.css";
import "./styles/theme.css";
import ThemeToggle from "~/components/ThemeToggle";

// Stamp data-theme on <html> before first paint so there is no
// flash-of-wrong-theme: SSR always renders the default (vivid) register,
// and this blocking script corrects it from localStorage pre-hydration.
const noFlashThemeScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("portfolio-theme");
    if (stored === "posh") {
      document.documentElement.setAttribute("data-theme", "posh");
    }
  } catch (e) {
    /* localStorage unavailable (private mode, etc.) — default register stands */
  }
})();
`;

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script dangerouslySetInnerHTML={{ __html: noFlashThemeScript }} />
      </head>
      <body>
        <Outlet />
        <ThemeToggle />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
