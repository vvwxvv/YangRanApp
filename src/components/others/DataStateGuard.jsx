import React from "react";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";

export const DEFAULT_STATE_LABELS = {
  errorTitle: { en: "Connection Failed", cn: "连接失败" },
  errorSubtitle: { en: "System temporarily unavailable", cn: "系统暂时不可用" },
  retry: { en: "Try Again", cn: "重试" },
  empty: { en: "No data available", cn: "暂无数据" },
};

export const DataStateGuard = ({
  isLoading,
  error,
  hasData,
  isCn,
  onRetry,
  labels = DEFAULT_STATE_LABELS,
}) => {
  if (isLoading) {
    return <LoadingLayer isLoading />;
  }

  if (error) {
    return (
      <AlertInfo
        message={isCn ? labels.errorTitle.cn : labels.errorTitle.en}
        subMessage={isCn ? labels.errorSubtitle.cn : labels.errorSubtitle.en}
        buttonText={isCn ? labels.retry.cn : labels.retry.en}
        messageCn={labels.errorTitle.cn}
        subMessageCn={labels.errorSubtitle.cn}
        buttonTextCn={labels.retry.cn}
        onBack={onRetry}
        isCn={isCn}
      />
    );
  }

  if (!hasData) {
    return <AlertInfo message={isCn ? labels.empty.cn : labels.empty.en} isCn={isCn} />;
  }

  return null;
};