import React from 'react';
import AlertInfo from './AlertInfo';
import { DEFAULT_MENUS } from '@/utils/siteMetaDefaults';
import useSiteMeta from '@/hooks/useSiteMeta';

/**
 * NoDataInfo - Friendly no data message for various schemas, using AlertInfo for consistent style
 * @param {string} schemaName - e.g., 'artwork', 'event', etc.
 * @param {boolean} isCn - true for Chinese, false for English
 */
export default function NoDataInfo({ schemaName, isCn }) {
  // Labels come from the Meta document's menus (JSON fallback).
  const { meta } = useSiteMeta();
  const langKey = isCn ? 'cn' : 'en';
  let label = '';
  if (schemaName) {
    // Try mainMenu first
    const menuSource = meta?.menu || DEFAULT_MENUS;
    const mainMenu = menuSource.mainMenu?.[langKey] || [];
    const found = mainMenu.find(item => item.href.replace('/', '').toLowerCase().includes(schemaName.toLowerCase()));
    if (found) label = found.label;
    // Optionally, could check managerMenu as well
  }
  // Fallback to previous display name if not found
  if (!label) {
    const schemaDisplay = {
      artwork: isCn ? '艺术品' : 'artwork',
      event: isCn ? '活动' : 'event',
      about: isCn ? '简介' : 'about',
      image: isCn ? '图片' : 'image',
      video: isCn ? '视频' : 'video',
      subscribe: isCn ? '订阅' : 'subscription',
      user: isCn ? '用户' : 'user',
    };
    label = schemaDisplay[schemaName] || schemaName || '';
  }
  const message = label ? `No ${label} data available.` : 'No data available.';
  const messageCn = label ? `暂无${label}数据。` : '暂无数据。';

  return (
    <AlertInfo message={message} messageCn={messageCn} isCn={isCn} />
  );
} 