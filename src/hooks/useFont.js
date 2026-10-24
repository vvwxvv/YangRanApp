// hooks/useFont.js
'use client';
import { useContext, useMemo } from 'react';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import { TYPE_SCALE, resolveFontFamily } from '@/lib/typography';

/**
 * useFont(role?)
 * ─────────────────────────────────────────────────────────────────────────
 * Language-aware wrapper around `resolveFontFamily` (lib/typography.js).
 * It returns FONT FAMILIES ONLY — never sizes, line-heights or tracking.
 *
 * @param {string} [role] a key in TYPE_SCALE (e.g. 'sectionTitle').
 *                        Unknown / missing → the `body` role.
 *
 * @returns {Object}
 *   fontFamily              this role's stack
 *   style                   { fontFamily } — spread-safe, family-only
 *   contentFontFamily       body copy        (role: bodyText)
 *   contentTitleFontFamily  headings         (role: sectionTitle)
 *   inputFontFamily         form inputs      (role: input)
 *   buttonFontFamily        button labels    (role: button)
 *   labelFontFamily         form labels      (role: label)
 *
 * Usage:
 *   const { fontFamily } = useFont('artistName');
 *   const { contentFontFamily } = useFont();
 *   <div style={{ fontFamily, fontSize: 18 }}>…</div>
 */
export default function useFont(role) {
  const { isCn } = useContext(LanguageContext);
  const lang = isCn ? 'zh' : 'en';

  return useMemo(() => {
    const effectiveRole =
      typeof role === 'string' && TYPE_SCALE[role] ? role : 'body';

    const fontFamily = resolveFontFamily(effectiveRole, lang);

    return {
      fontFamily,
      style: { fontFamily },
      contentFontFamily: resolveFontFamily('bodyText', lang),
      contentTitleFontFamily: resolveFontFamily('sectionTitle', lang),
      inputFontFamily: resolveFontFamily('input', lang),
      buttonFontFamily: resolveFontFamily('button', lang),
      labelFontFamily: resolveFontFamily('label', lang),
    };
  }, [role, lang]);
}
