"use client";

import React, {
  useContext,
  useMemo,
  useCallback,
  useState,
} from "react";

import { LanguageContext } from "@/components/contexts/LanguageContext";
import { DeviceContext } from "@/components/contexts/DeviceContext";
import useData from "@/hooks/useData";
import useFont from "@/hooks/useFont";
import LoadingAnimation from "@/components/animations/LoadingAnimation";
import AlertInfo from "@/components/alerts/AlertInfo";
import TwoColumnDetailSection from "@/components/details/TwoColumnDetailSection";
import ImageZoomModal from "@/components/images/ImageZoomModal";
import PDFViewerButton from "@/components/buttons/PDFViewerButton";
import { useReverseTheme } from "@/hooks/useReverseTheme";

// UI Text Configuration
const UI_TEXT = {
  loadingError: { en: "Connection Failed", cn: "连接失败" },
  systemError: { en: "System temporarily unavailable", cn: "系统暂时不可用" },
  tryAgain: { en: "Try Again", cn: "重试" },
  noData: { en: "No about data available", cn: "暂无关于数据" },
};

// Portfolio PDF configuration.
// The URL comes from the About record's own `pdf_url` (Prisma About.pdf_url),
// with the env var as a fallback when the record has none.
const PDF_CONFIG = {
  fallbackUrl: process.env.NEXT_PUBLIC_PDF_PORTFOLIO_URL || "",
  buttonText: { cn: "查看作品集", en: "View Portfolio" },
  titleCn: "作品集",
  titleEn: "Portfolio",
  authorCn: process.env.NEXT_PUBLIC_APP_PERSON_CN || "",
  authorEn: process.env.NEXT_PUBLIC_APP_PERSON_EN || "",
  year: "",
};

const AboutPageComponent = () => {
  const { isCn } = useContext(LanguageContext);
  const { isMobile } = useContext(DeviceContext);
  const { fontFamily } = useFont();
  const { colors } = useReverseTheme();

  // Image zoom modal state
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);
  const [zoomedImageTitle, setZoomedImageTitle] = useState("");

  // Data fetching
  const { data = [], isLoading, error, refetch } = useData("/api/about");

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // Filter data by language
  const filteredByLang = useMemo(() => {
    try {
      if (!data?.length) return [];
      return data.filter((item) =>
        isCn ? item?.language === "CN" : item?.language === "EN"
      );
    } catch (err) {
      console.warn("Error filtering data by language:", err);
      return [];
    }
  }, [data, isCn]);

  const aboutItem = useMemo(() => {
    try {
      return filteredByLang[0] || data[0] || {};
    } catch (err) {
      console.warn("Error getting about item:", err);
      return {};
    }
  }, [filteredByLang, data]);

  // Image zoom handlers
  const handleImageClick = useCallback((imageUrl, title = "") => {
    setZoomedImageUrl(imageUrl);
    setZoomedImageTitle(title);
    setIsImageZoomed(true);
  }, []);

  const handleCloseZoom = useCallback(() => {
    setIsImageZoomed(false);
    setZoomedImageUrl(null);
    setZoomedImageTitle("");
  }, []);

  // Portfolio PDF: the About record's `pdf_url` wins, env is the fallback.
  const portfolioUrl = aboutItem?.pdf_url || PDF_CONFIG.fallbackUrl;

  const PDFButtonComponent = portfolioUrl ? (
    <PDFViewerButton
      pdfUrl={portfolioUrl}
      buttonText={PDF_CONFIG.buttonText}
      titleCn={PDF_CONFIG.titleCn}
      titleEn={PDF_CONFIG.titleEn}
      authorCn={PDF_CONFIG.authorCn}
      authorEn={PDF_CONFIG.authorEn}
      year={PDF_CONFIG.year}
      colors={colors}
      fontFamily={fontFamily}
      isCn={isCn}
    />
  ) : null;

  // Loading state
  if (isLoading) {
    return <LoadingAnimation isLoading={true} />;
  }

  // Error handling
  if (error) {
    return (
      <AlertInfo
        message={isCn ? UI_TEXT.loadingError.cn : UI_TEXT.loadingError.en}
        subMessage={isCn ? UI_TEXT.systemError.cn : UI_TEXT.systemError.en}
        buttonText={isCn ? UI_TEXT.tryAgain.cn : UI_TEXT.tryAgain.en}
        messageCn={UI_TEXT.loadingError.cn}
        subMessageCn={UI_TEXT.systemError.cn}
        buttonTextCn={UI_TEXT.tryAgain.cn}
        onBack={handleRetry}
        isCn={isCn}
      />
    );
  }

  // No data state
  if (!data?.length && !error) {
    return (
      <AlertInfo
        message={isCn ? UI_TEXT.noData.cn : UI_TEXT.noData.en}
        isCn={isCn}
      />
    );
  }

  // Main render — centered responsive layout
  return (
    <div
      className="font-mono min-h-screen scrollbar-thin-black"
      style={{
        fontFamily,
        backgroundColor: colors.background,
        color: colors.text,
      }}
    >
      {/* Centered container for responsive layout */}
      <div
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: isMobile ? 58 : 101 }}
      >
        <TwoColumnDetailSection
          dataItem={aboutItem}
          twoColumnMode={false}
          showCoverImage={true}
          showContentSection={true}
          fieldConfig={{
            coverImage: {
              field: "portrait_image_url",
              titleField: "caption",
              defaultUrl: "/no-image.png",
            },
            sections: [
              {
                id: "mainHeading",
                field: "caption",
                type: "heading",
                style: {
                  color: colors.text,
                  fontSize: isMobile ? "14px" : "15px",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  margin: 0,
                  letterSpacing: "0.015em",
                  textAlign: "left",
                },
              },
              {
                id: "introduction",
                field: "introductions",
                type: "array",
                style: {
                  color: colors.text,
                  fontSize: "12px",
                  fontWeight: 400,
                  lineHeight: "1.8",
                },
                itemStyle: {
                  textAlign: "left",
                  lineHeight: 1.65,
                  fontSize: isMobile ? "14px" : "15px",
                  letterSpacing: "0.015em",
                  margin: "0 0 18px 0",
                  color: colors.text,
                },
              },
            ],
          }}
          onImageClick={handleImageClick}
          contentSectionProps={{
            paddingTop: "20px",
          }}
          additionalRightContent={PDFButtonComponent}
        />


      </div>

      {/* Image Zoom Modal */}
      <ImageZoomModal
        isOpen={isImageZoomed}
        onClose={handleCloseZoom}
        imageUrl={zoomedImageUrl}
        title={zoomedImageTitle || aboutItem?.caption || "About Image"}
        content={aboutItem}
      />
    </div>
  );
};

export default AboutPageComponent;
