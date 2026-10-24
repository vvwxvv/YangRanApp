/**
 * The entity key a form belongs to ("artwork", "event" …).
 *
 * Both shells already receive enough information to know it:
 *   FormShell      → config.itemUrl   ("artwork")
 *   EditFormShell  → apiRoute         ("/api/artwork")
 * so no form file has to pass a new prop.
 */
export function resolveFormKey(config, apiRoute) {
  const fromConfig = config?.itemUrl || config?.entity || config?.formKey;
  if (typeof fromConfig === 'string' && fromConfig.trim()) {
    return fromConfig.trim().replace(/^\/?api\//, '').split(/[/?#]/)[0] || null;
  }
  if (typeof apiRoute === 'string') {
    const match = apiRoute.match(/\/api\/([^/?#]+)/);
    if (match) return match[1];
  }
  return null;
}
