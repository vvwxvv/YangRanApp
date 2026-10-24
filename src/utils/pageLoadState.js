/**
 * pageLoadState — a tiny global counter of in-flight page data requests.
 *
 * Why: the layout (nav + footer) used to paint immediately while the page's
 * data was still loading, so users saw finished-looking chrome around an empty
 * page, and the footer could even reveal itself because the document was still
 * short. The shell now waits for this counter to reach zero and shows only a
 * loader until it does.
 *
 * Only data hooks call it (`useData`), so pages that fetch nothing reveal
 * immediately.
 */

const tokens = new Set();
const listeners = new Set();

const notify = () => {
  for (const listener of listeners) {
    try {
      listener(tokens.size);
    } catch {
      /* a broken listener must not stop the others */
    }
  }
};

/** Mark a request as started. Returns a token to pass back to endLoad(). */
export function beginLoad() {
  const token = Symbol("load");
  tokens.add(token);
  notify();
  return token;
}

/** Mark a request as settled. Ignores unknown/duplicate tokens. */
export function endLoad(token) {
  if (!token) return;
  if (tokens.delete(token)) notify();
}

export const getActiveLoads = () => tokens.size;

export function subscribeLoad(listener) {
  listeners.add(listener);
  listener(tokens.size);
  return () => listeners.delete(listener);
}
