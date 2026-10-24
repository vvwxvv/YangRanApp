import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function useSwitcher(options = {}) {
  const { hideOnSlugOf = [], extraHidePaths = [], onlyUnderPath = null } = options;
  const pathname = usePathname() || '';
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSlugPage = useMemo(() => {
    if (!hideOnSlugOf.length) return false;
    const group = hideOnSlugOf.map(seg => seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const slugRegex = new RegExp(`^/(${group})/[^/]+/?$`);
    return slugRegex.test(pathname);
  }, [pathname, hideOnSlugOf]);

  const matchesExtraHide = useMemo(() => {
    if (!extraHidePaths.length) return false;
    return extraHidePaths.some(s => (s ? pathname.includes(s) : false));
  }, [pathname, extraHidePaths]);

  const outsideOnlyUnder = useMemo(() => {
    if (!onlyUnderPath) return false;
    return !pathname.startsWith(onlyUnderPath);
  }, [pathname, onlyUnderPath]);

  const shouldHide = isSlugPage || matchesExtraHide || outsideOnlyUnder;

  return { mounted, shouldHide, pathname };
}
