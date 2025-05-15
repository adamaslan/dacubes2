import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

// import tailwindStylesheetUrl from "./tailwind.css"; // REMOVE THIS
import globalStylesHref from "./styles/global.css"; // ADD THIS

export const links: LinksFunction = () => [
  // { rel: "stylesheet", href: tailwindStylesheetUrl }, // REMOVE THIS
  { rel: "stylesheet", href: globalStylesHref },   // ADD THIS
  // You might also want to link fonts here if not done in global.css
  // e.g., { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" }
  // from your contact.css
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
