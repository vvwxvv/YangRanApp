"use client";

/* ═══════════════════════════════════════════════════════════════════════════
   LayoutContent — the whole site shell in ONE file.

   Everything the root layout needs lives here on purpose: the auth gate, the
   nav / back-button / writing-dock shell, and the page-loading gate — one
   file, one import from `app/layout.jsx`.
   ═══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useState, useContext } from "react";
import { AtomicState } from "atomic-utils";
import { Box, Alert, CircularProgress } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DeviceContext } from "@/components/contexts/DeviceContext";
import { ManagerContext } from "@/components/contexts/ManagerContext";
import Footer from "@/components/footers/Footer";
import ConstructionBWPageComponent from "@/components/pages/constructions/ConstructionBWPageComponent";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import ManagerSideNav from "@/components/navs/ManagerSideNav";
import MainNav from "@/components/navs/MainNav";
import BackButton from "@/components/buttons/BackButton";
import WritingSidePanel from "@/components/drawers/WritingSidePanel";
import PatternLock from "@/components/lockers/PatternLock";
import useFont from "@/hooks/useFont";
import useBackgroundColor from "@/hooks/useBackgroundColor";
import { usePatternAuth } from "@/hooks/usePatternAuth";
import { isHomepage } from "@/utils/routeUtils";
import { releaseStuckScrollLock } from "@/utils/scrollLock";
import { subscribeLoad } from "@/utils/pageLoadState";

// How long the shell waits before revealing (ms). Kept here on purpose:
// this file is the only consumer, so the value lives with the code that uses it.
const LAYOUT_LOADING_TIME = 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5分钟缓存
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/* ───────────────────────────────────────────────────────────────────────────
   Auth gate (manager only) — blocks children behind the pattern lock.
   ─────────────────────────────────────────────────────────────────────────── */
function ManagerAuthGate({ children }) {
  const {
    isAuthenticated,
    isChecking,
    error: authError,
    authenticate,
    clearError,
  } = usePatternAuth();

  if (isChecking) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--background-primary, #ffffff)",
        }}
      >
        <CircularProgress sx={{ color: "var(--text-primary, #000000)" }} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "var(--background-primary, #ffffff)",
          gap: 2,
        }}
      >
        {authError && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
            {authError}
          </Alert>
        )}
        <PatternLock onSuccess={authenticate} />
      </Box>
    );
  }

  return <>{children}</>;
}

/* ───────────────────────────────────────────────────────────────────────────
   Main content shell — nav, back button, writing dock, page body.
   Manager pages use the bar + drawer; public pages keep MainNav.
   ─────────────────────────────────────────────────────────────────────────── */
function LayoutMainContent({ children, showBackButton, isMobile, backgroundColor }) {
  const { isManager } = useContext(ManagerContext);
  // MainNav uses the drawer (and hides the desktop nav row) on mobile + tablet.
  const { isTablet } = useContext(DeviceContext);

  const pathname = usePathname() || "";
  const router = useRouter();

  // Manager pages use a bar + drawer (no fixed rail); public pages keep the
  // horizontal MainNav.
  const pt = isManager ? "52px" : 0;

  const navSlot = isManager ? (
    <ManagerSideNav />
  ) : (
    <Box sx={{ position: "relative", zIndex: 1100 }} style={{ background: "transparent" }}>
      <MainNav />
    </Box>
  );

  const segments = pathname.split("/").filter(Boolean);
  // Every public non-home page gets the layout back button. Archive pages
  // already render their own inline » control, so skip the duplicate there.
  const isArchivePage = pathname === "/archive" || pathname === "/artworks/archive";
  const showLayoutBack =
    showBackButton && pathname !== "/" && !isManager && !isArchivePage;

  const goToParent = () => {
    const parent = "/" + segments.slice(0, -1).join("/");
    router.push(parent === "/" ? "/" : parent);
  };

  const backRow = showLayoutBack ? (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        padding: isMobile ? "0 16px" : "0 40px",
        marginTop: 8,
        marginBottom: 20,
      }}
    >
      <BackButton onClick={goToParent} />
    </div>
  ) : null;

  const content = (
    <>
      {navSlot}

      {/* The writing dock lives in the shared layout so every public page
          gets the same button + drawer — except the archive, which already
          has its own Writing tab and should not show a second rail. */}
      {!isManager && !isArchivePage && <WritingSidePanel />}

      {backRow}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          overflowY: "auto",
          // The footer sits in normal flow at the end of the page (it reveals
          // on scroll), so no bottom reserve is needed here.
          pb: 0,
          pt,
          minWidth: 0,
          position: "relative",
        }}
        style={{ backgroundColor, background: backgroundColor }}
      >
        {children}
      </Box>
    </>
  );

  if (isManager) {
    return <ManagerAuthGate>{content}</ManagerAuthGate>;
  }

  return content;
}

/* ───────────────────────────────────────────────────────────────────────────
   Small layout hooks
   ─────────────────────────────────────────────────────────────────────────── */
function useUnderConstruction() {
  const [isUnderConstruction, setIsUnderConstruction] = useState(false);
  useEffect(() => {
    const envValue = String(process?.env?.NEXT_PUBLIC_APP_UNDER_CONSTRUCTION ?? "")
      .trim()
      .toLowerCase();
    setIsUnderConstruction(envValue === "true");
  }, []);
  return isUnderConstruction;
}

function useLayoutReady(delay = LAYOUT_LOADING_TIME) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return isReady;
}

/** Forces html/body background transparent while construction page is active. */
function useTransparentBody(active) {
  useEffect(() => {
    if (!active) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    html.style.backgroundColor = "transparent";
    body.style.backgroundColor = "transparent";
    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
    };
  }, [active]);
}

/* ───────────────────────────────────────────────────────────────────────────
   LayoutContent — client-ready gate, construction mode, page-loading gate,
   then the normal shell (main content + footer).
   ─────────────────────────────────────────────────────────────────────────── */
export default function LayoutContent({ children }) {
  const [isClientReady, setIsClientReady] = useState(false);
  const isLayoutReady = useLayoutReady();
  const isUnderConstruction = useUnderConstruction();

  const pathname = usePathname();
  const showBackButton = !isHomepage(pathname);

  const { style } = useFont();
  const { isMobile } = useContext(DeviceContext);
  const { backgroundColor } = useBackgroundColor("transparent", { useCustomColor: true });

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  // Safety net: a page transition must never leave the document scroll-locked
  // (e.g. a loader that mounted while the mobile menu was open). Anything that
  // legitimately locks scroll keeps a modal mounted, so this only fires when
  // nothing needs the lock.
  useEffect(() => {
    const t = setTimeout(releaseStuckScrollLock, 250);
    return () => clearTimeout(t);
  }, [pathname]);

  // ── page loading gate ────────────────────────────────────────────────────
  // `activeLoads` comes from useData(); `routeSettled` covers pages that fetch
  // nothing (they reveal right away). `maxWait` is a release valve so a hung
  // request can never trap the user on the loader forever.
  const [activeLoads, setActiveLoads] = useState(0);
  const [routeSettled, setRouteSettled] = useState(false);
  const [maxWait, setMaxWait] = useState(false);

  useEffect(() => subscribeLoad(setActiveLoads), []);

  useEffect(() => {
    setRouteSettled(false);
    setMaxWait(false);
    const settle = setTimeout(() => setRouteSettled(true), 300);
    // Safety valve only: data hooks time out on their own (45s × retries).
    const cap = setTimeout(() => setMaxWait(true), 180000);
    return () => {
      clearTimeout(settle);
      clearTimeout(cap);
    };
  }, [pathname]);

  // Reveal only after the requests have been quiet for a moment. A page can
  // start a second fetch right after the first one lands (e.g. it waits for the
  // Meta doc, then loads its own list), and revealing on the first dip showed
  // the page's internal "LOADING…" inside a finished-looking shell.
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (maxWait) {
      setPageReady(true);
      return undefined;
    }
    if (!routeSettled) {
      setPageReady(false);
      return undefined;
    }
    if (activeLoads > 0) {
      setPageReady(false);
      return undefined;
    }
    // Long enough for the page to commit its first real render (a 42-row list
    // can take a few hundred ms after its data lands).
    const settle = setTimeout(() => setPageReady(true), 1200);
    return () => clearTimeout(settle);
  }, [routeSettled, activeLoads, maxWait]);

  // ── window "load" ────────────────────────────────────────────────────────
  // Data hooks tell us when the page's requests are done; the window `load`
  // event adds fonts / images on top, so the nav (and every label in it) only
  // appears once the page is genuinely finished. Capped so one stuck asset can
  // never hold the shell hostage.
  const [windowLoaded, setWindowLoaded] = useState(false);

  useEffect(() => {
    setWindowLoaded(false);
    if (typeof window === "undefined") return undefined;
    if (document.readyState === "complete") {
      setWindowLoaded(true);
      return undefined;
    }
    const onLoad = () => setWindowLoaded(true);
    window.addEventListener("load", onLoad);
    const cap = setTimeout(() => setWindowLoaded(true), 12000);
    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(cap);
    };
  }, [pathname]);

  // The shell (nav labels included) stays invisible until: layout delay done,
  // route settled, every tracked data request finished, and the window loaded.
  const pageLoading = !pageReady || (activeLoads > 0 && !maxWait) || !windowLoaded;

  useTransparentBody(isClientReady && isUnderConstruction);

  // 1. Pre-hydration — empty
  if (!isClientReady) {
    return null;
  }

  // 2. Construction mode
  if (isUnderConstruction) {
    return (
      <>
        {isLayoutReady && (
          <div style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }}>
            <ConstructionBWPageComponent />
          </div>
        )}
      </>
    );
  }

  // 3. Normal layout
  const containerStyle = { backgroundColor, background: backgroundColor };

  return (
    <QueryClientProvider client={queryClient}>
      {(!isLayoutReady || pageLoading) && <LoadingAnimation isLoading holdsGate={false} />}

      {(
        <Box
          sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
          style={{
            ...style,
            ...containerStyle,
            visibility: isLayoutReady && !pageLoading ? "visible" : "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              width: "100%",
              position: "relative",
            }}
            style={containerStyle}
          >
            {/* Language switcher is rendered by the main-content shell (it
                owns the fixed top-right position) — rendering it here too
                stacked two copies on top of each other. */}

            <AtomicState>
              <LayoutMainContent
                showBackButton={showBackButton}
                isMobile={isMobile}
                backgroundColor={backgroundColor}
              >
                {children}
              </LayoutMainContent>
            </AtomicState>
          </Box>
          <Footer />
        </Box>
      )}
    </QueryClientProvider>
  );
}
