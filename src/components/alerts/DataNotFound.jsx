// components/shared/DataNotFound.jsx
"use client";
import React from "react";
import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";
import AlertInfo from "@/components/alerts/AlertInfo";
import { useContext } from "react";
import { LanguageContext } from "@/components/contexts/LanguageContext";

export default function DataNotFound() {
  const { isCn } = useContext(LanguageContext);

  const texts = {
    title: isCn ? "未找到数据" : "Data not found",
    subtitle: isCn
      ? "请求的项目不存在或已被删除。"
      : "The requested item could not be located.",
    backLabel: isCn ? "返回列表" : "Back to list",
  };

  return (
    <Container
      maxWidth="90vw"
      sx={{
        border: "1px solid var(--border-light, #000000)",
        borderRadius: "12px",
        boxShadow: "var(--shadow-medium, 0 6px 20px rgba(0,0,0,0.08))",
        backgroundColor: "var(--background-primary, #ffffff)",
        color: "var(--text-primary, #000000)",
        width: "90vw",
        maxWidth: "90vw",
        mt: 1,
        mb: 2.5,
        p: 4,
      }}
    >
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: "12px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          backgroundColor: "white",
          width: "100%",
          mt: 6,
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <AlertInfo
            message={texts.title}
            subMessage={texts.subtitle}
            buttonText={texts.backLabel}
            onBack={() => window.history.back()}
            isCn={isCn}
          />
        </motion.div>
      </Box>
    </Container>
  );
}