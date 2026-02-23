// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import "./app.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import MainLayout from "./ui/layout/mainLayout";
import ThemeProvider from "./lib/providers/themeProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" {...mantineHtmlProps}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ColorSchemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
