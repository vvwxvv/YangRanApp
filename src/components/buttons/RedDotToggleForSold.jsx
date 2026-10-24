import React from 'react';
import { motion } from 'framer-motion';

const RedDotToggleForSold = ({ sold }) => (
    sold === 'sold' ? (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="inline-block w-2.5 h-2.5 bg-red-600 rounded-full ml-2"
        title="Sold"
      />
    ) : null
  )

  export default RedDotToggleForSold;