"use client";
import "../app/globals.css";
import { ThemeProvider } from "next-themes";
import Meta from "@/components/meta/meta";
import { LanguageProvider } from "@/components/contexts/LanguageContext";
import { DeviceProvider } from "@/components/contexts/DeviceContext";
import { ManagerProvider } from "@/components/contexts/ManagerContext";
import ThemeInitializer from "@/components/others/ThemeInitializer";
import HydrationSafeWrapper from "@/components/others/HydrationSafeWrapper";
import LayoutContent from "@/components/layouts/LayoutContent";


/**
 * Root layout.
 * Responsibility: provider tree only — no logic, no state, no UI.
 * All layout orchestration lives in LayoutContent and its children.
 */
export default function Layout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Meta />
      </head>
      <body suppressHydrationWarning>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange={false}
            storageKey="theme"
            themes={["light", "dark"]}
          >
            <ThemeInitializer />
            <ManagerProvider>
              <DeviceProvider>
                <HydrationSafeWrapper>
                  <LayoutContent>{children}</LayoutContent>
                </HydrationSafeWrapper>
              </DeviceProvider>
            </ManagerProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}