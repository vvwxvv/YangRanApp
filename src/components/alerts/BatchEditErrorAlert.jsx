"use client";

import AlertInfo from '@/components/alerts/AlertInfo';

export default function BatchEditErrorAlert({ error, subMessage, onBack, isCn }) {
  return (
    <AlertInfo
      message={error ? error.toString() : (isCn ? '批量编辑出错' : 'Batch edit error')}
      subMessage={subMessage}
      onBack={onBack}
      isCn={isCn}
    />
  );
}
