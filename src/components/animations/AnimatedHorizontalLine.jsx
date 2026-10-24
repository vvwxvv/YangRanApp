import React from "react";
import { motion } from "framer-motion";

const AnimatedHorizontalLine = ({ colors, style }) => (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{
        height: "1px",
        backgroundColor: colors.text,
        ...style,
      }}
    />
  );

  export default AnimatedHorizontalLine;
  