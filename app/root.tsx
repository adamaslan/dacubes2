import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import "./styles/global.css";
// import type { LinksFunction } from "@remix-run/node";

// Don't import CSS files with 'import ... from' syntax
// import globalStylesHref from "./styles/global.css"; // This is wrong

// CSS files should be referenced in the links function
// export const links: LinksFunction = () => [
//   { rel: "stylesheet", href: "/styles/global.css" },
//   // You might also want to link fonts here if not done in global.css
//   // e.g., { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap" }
//   // from your contact.css
// ];

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
