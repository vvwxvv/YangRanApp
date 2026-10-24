import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useInteraction } from "@/hooks/useInteraction";

/**
 * Generic hook for menu-item interaction + navigation.
 *
 * @param {object}   options
 * @param {string}   options.href               - destination path
 * @param {object}   [options.customActions]     - map of href patterns to handler functions
 *                                                 e.g. { "/subscribe": () => openPopup(), "/login": () => openAuth() }
 * @param {function} [options.onNavigate]        - called after a normal navigation (e.g. close drawer)
 * @param {function} [options.onBeforeNavigate]  - called before navigation, return false to prevent
 * @param {number}   [options.touchHoverDelay=100]
 *
 * @example
 * // Subscribe + login as custom actions
 * useMenuItemNavigation({
 *   href: item.href,
 *   customActions: {
 *     "/subscribe": () => openNewsletterPopup(),
 *     "/manager/subscribe": () => openNewsletterPopup(),
 *     "/login": () => openAuthModal(),
 *   },
 *   onNavigate: closeDrawer,
 * });
 */
export function useMenuItemNavigation({
  href,
  customActions = {},
  onNavigate,
  onBeforeNavigate,
  touchHoverDelay = 100,
}) {
  const router = useRouter();
  const { hovered, pressed, handlers, reset } = useInteraction({
    touchHoverDelay,
  });

  // Check if this href matches any custom action (exact match or pattern)
  const matchedAction = useMemo(() => {
    if (!href) return null;

    // Exact match first
    if (customActions[href]) return customActions[href];

    // Pattern match (startsWith) for flexible matching
    const patternKey = Object.keys(customActions).find(
      (pattern) => pattern.endsWith("*") && href.startsWith(pattern.slice(0, -1))
    );
    return patternKey ? customActions[patternKey] : null;
  }, [href, customActions]);

  const isCustomAction = !!matchedAction;

  const handleClick = useCallback(
    (e) => {
      if (isCustomAction) {
        e.preventDefault();
        matchedAction(e);
        return;
      }

      // Allow onBeforeNavigate to cancel
      if (onBeforeNavigate && onBeforeNavigate(href) === false) {
        e.preventDefault();
        return;
      }

      // Normal <Link> handles routing; just fire onNavigate callback
      onNavigate?.();
    },
    [isCustomAction, matchedAction, href, onBeforeNavigate, onNavigate]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();

      if (isCustomAction) {
        matchedAction(e);
        return;
      }

      if (onBeforeNavigate && onBeforeNavigate(href) === false) return;

      if (href) {
        router.push(href);
        onNavigate?.();
      }
    },
    [isCustomAction, matchedAction, href, router, onBeforeNavigate, onNavigate]
  );

  return {
    hovered,
    pressed,
    handlers,
    reset,
    handleClick,
    handleKeyDown,
    isCustomAction,
    /** @deprecated use isCustomAction instead */
    isSubscription: isCustomAction,
  };
}