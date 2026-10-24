/**
 * Returns the item's localized title or a fallback.
 * Works with Prisma models that have title_en and title_cn fields.
 *
 * @param {Object} item - Prisma item (Series, Artwork, etc.) with title_en/title_cn
 * @param {string} locale - Current locale: 'en' or 'cn' (default 'en')
 * @returns {string}
 */
export default function resolveTitle(item, locale = 'en') {
  if (!item) return locale === 'cn' ? '无标题' : 'Untitled';

  const titleField = locale === 'cn' ? 'title_cn' : 'title_en';
  const title = item[titleField];

  if (title && title.trim()) return title;

  // Fallback: try the other language if available
  const otherField = locale === 'cn' ? 'title_en' : 'title_cn';
  const otherTitle = item[otherField];
  if (otherTitle && otherTitle.trim()) return otherTitle;

  // Final fallback
  return locale === 'cn' ? '无标题' : 'Untitled';
}