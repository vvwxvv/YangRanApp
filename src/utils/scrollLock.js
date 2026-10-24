/**
 * scrollLock — a single owner for `body.style.overflow`.
 *
 * Why this exists: several unrelated components lock page scroll
 * (the loading screen, MUI drawers/dialogs, the writing panel, popups).
 * Each one used to snapshot `body.style.overflow` when it locked and write
 * that snapshot back when it unlocked. If a second lock was acquired while
 * the first was still held, the snapshot itself was "hidden" — and whoever
 * unlocked last restored the page to "hidden", permanently. The page then
 * cannot scroll until a full reload (very visible on the manager pages,
 * where you open the menu, pick another section, and the list freezes).
 *
 * Rules used here:
 *  - only touch `body`; `html` is left alone (body overflow propagates to the
 *    viewport, and leaving `html` alone avoids a second stale value).
 *  - capture the "real" previous value once (a value of "hidden" is treated
 *    as "not ours" and never written back).
 *  - on unlock, if a MUI modal/drawer is still open, leave the lock in place
 *    and let MUI release it itself; otherwise restore the captured value.
 */

let lockCount = 0;
let savedOverflow = "";

const hasOpenModal = () =>
  typeof document !== "undefined" && !!document.querySelector(".MuiModal-root");

/** Lock page scroll. Safe to call repeatedly; must be paired with unlockScroll. */
export function lockScroll() {
  if (typeof document === "undefined") return;
  const body = document.body;
  if (lockCount === 0) {
    const current = body.style.overflow;
    // "hidden" here belongs to somebody else's lock — never restore it later.
    savedOverflow = current === "hidden" ? "" : current;
  }
  lockCount += 1;
  body.style.overflow = "hidden";
}

/** Release one scroll lock. */
export function unlockScroll() {
  if (typeof document === "undefined") return;
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount > 0) return;
  // A drawer/dialog still on screen owns the lock now; MUI will clear it.
  if (hasOpenModal()) return;
  document.body.style.overflow = savedOverflow;
  savedOverflow = "";
}

/**
 * Safety net for any lock that was left behind by a component that unmounted
 * out of order. Called on navigation, when no overlay is open.
 */
export function releaseStuckScrollLock() {
  if (typeof document === "undefined") return;
  if (lockCount > 0) return;
  if (hasOpenModal()) return;
  if (document.body.style.overflow === "hidden") {
    document.body.style.overflow = "";
  }
  if (document.documentElement.style.overflow === "hidden") {
    document.documentElement.style.overflow = "";
  }
}

export const getScrollLockCount = () => lockCount;
