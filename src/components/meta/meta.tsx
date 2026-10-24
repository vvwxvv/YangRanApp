import { useEffect } from 'react';
import useSiteMeta from '@/hooks/useSiteMeta';

/**
 * Document head / SEO tags.
 *
 * Every SEO value comes from the Meta document (`meta.seo`), editable in
 * `/manager/meta`. The non-editable document tags (charset, viewport, PWA
 * metas) are hardcoded here — no need to manage them as settings.
 */
interface SeoMeta {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  og_image?: string;
  icon?: string;
  manifest?: string;
  canonical?: string;
}

const Meta: React.FC = () => {
  const { meta } = useSiteMeta();
  const seo: SeoMeta = (meta?.seo || {}) as SeoMeta;

  // Keep the document title in sync with the Meta doc.
  useEffect(() => {
    if (seo?.title) document.title = seo.title;
  }, [seo?.title]);

  const canonical =
    seo.canonical || (typeof window !== 'undefined' ? window.location.href : undefined);

  return (
    <>
      {/* Constant document tags — hardcoded, not manager settings */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* SEO — all from the Meta doc */}
      <meta name="apple-mobile-web-app-title" content={seo.title} />
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.og_image} />
      <meta property="og:type" content="web" />
      <link rel="manifest" href={seo.manifest} />
      <link rel="icon" href={seo.icon} />
      <link rel="shortcut icon" href={seo.icon} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en" href={canonical} />
      <title>{seo.title}</title>
    </>
  );
};

export default Meta;
