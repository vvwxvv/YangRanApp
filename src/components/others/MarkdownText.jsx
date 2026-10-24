import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { preprocessMarkdownText } from "@/utils/PreprocessMarkdownText";
import useFont from '@/hooks/useFont';

const MarkdownText = ({ text }) => {
  const { style: labelFontStyle } = useFont();

  if (!text) return null;

  const processedText = preprocessMarkdownText(text);

  return (
    <div style={labelFontStyle}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {processedText}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownText;