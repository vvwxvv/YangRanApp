import React from "react";
import { Divider } from "@/components/ui/divider";
import { motion } from 'framer-motion';
import useFont from '@/hooks/useFont';

const PageTitle = ({ title, subtitle }) => {
  const { contentTitleFontFamily } = useFont();
  const motionDivStyle = {
    display: 'inline-block',
    marginTop: '0px',
    fontWeight: 'bold',
    fontSize: '20px',
    color: 'var(--text-primary, black)',
    textTransform: 'uppercase',
    fontFamily: contentTitleFontFamily,
  };

  const subtitleStyle = {
    fontSize: '12px',
  };


  return (
    <>
      <motion.div
        style={motionDivStyle}
        transition={{ repeat: Infinity, duration: 60 }}
      >
        &nbsp; &nbsp; {title}
        {subtitle && <span style={subtitleStyle}>{subtitle}</span>}
      </motion.div>
       <Divider variant="dashed" thickness="thin" color="var(--text-primary, black)" className="my-6" />
    </>
  );
};

export default PageTitle;