import React, { useContext } from 'react';
import InfoBanner from '@/components/banners/InfoBanner';
import { LanguageContext } from '@/components/contexts/LanguageContext';

const MediaTagInfoBanner = () => {
  const { isCn } = useContext(LanguageContext);

  const title = isCn ? '为什么要选择标签来源？' : 'Why select a Tag Source?';
  
  // Directly define the description as JSX (no unused string variable)
  const descriptionJSX = isCn ? (
    <>
      将图片关联到某件<strong>艺术品</strong>、<strong>活动</strong>或<strong>项目</strong>后，
      系统会自动将该图片归入对应条目的图片集。
      浏览该艺术品或活动的访客将能看到此图片。
      如无需关联，请选择<em>「无」</em>并手动输入自定义标签。
    </>
  ) : (
    <>
      Linking this image to an <strong>Artwork</strong>, <strong>Event</strong>, or{' '}
      <strong>Project</strong> tells the system which gallery this image belongs to.
      Once linked, this image will automatically appear inside that item's image list —
      so visitors browsing that artwork or event will see it.
      If you don't need a link, choose <em>None</em> and type a custom label instead.
    </>
  );

  return (
    <InfoBanner
      title={title}
      description={descriptionJSX}
      ariaLabel={isCn ? '标签来源说明' : 'Tag source information'}
    />
  );
};

export default MediaTagInfoBanner;