import React from "react";
import { motion } from "framer-motion";

const FONT_SIZE = "16px";

const VerticalSeparator = ({ colors }) => (
    <motion.span
      variants={{hidden: { opacity: 0, y: -10 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3 },
      }}}
      className="mx-4 font-light"
      style={{ color: colors.text, opacity: 0.6, fontSize: FONT_SIZE }}
    >
      |
    </motion.span>
  );
  
export default VerticalSeparator;  