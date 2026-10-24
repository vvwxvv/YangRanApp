"use client";
import React from "react";
import { motion } from "framer-motion";

const AnimatedUnderline = ({ active, color = "var(--text-primary, #000)" }) => (
  <motion.div
  initial={{ scaleX: 0 }}
  animate={{ scaleX: active ? 1 : 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
  className="absolute bottom-0 left-0 right-0"
  style={{
    height: "2px",
    backgroundColor: color,
    transformOrigin: "left",
    pointerEvents: "none", 
    }}
  />
);

export default AnimatedUnderline;