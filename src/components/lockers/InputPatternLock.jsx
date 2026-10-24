"use client";
import { useEffect, useRef, useState, useContext } from 'react';
import { Box, Dialog, styled } from '@mui/material';
import { motion } from 'framer-motion';
import { DeviceContext } from '@/components/contexts/DeviceContext';
import { LanguageContext } from '@/components/contexts/LanguageContext';

/* ---------- 9-dot positions ---------- */
const points = [
  { x: 100, y: 100, id: 1 }, { x: 200, y: 100, id: 2 }, { x: 300, y: 100, id: 3 },
  { x: 100, y: 200, id: 4 }, { x: 200, y: 200, id: 5 }, { x: 300, y: 200, id: 6 },
  { x: 100, y: 300, id: 7 }, { x: 200, y: 300, id: 8 }, { x: 300, y: 300, id: 9 },
];

/* ---------- styled canvas (black & white) ---------- */
/* ---------- styled canvas (plain) ---------- */
const StyledCanvas = styled('canvas')(() => ({
  border: '3px solid #000',
  borderRadius: 8,
  backgroundColor: '#fff',
  minWidth: 400,
  minHeight: 400,
  '@media (max-width:600px)': { minWidth: 300, minHeight: 300 },
}));

/* ---------- component ---------- */
export default function InputPatternLock({ onSuccess, onClose }) {
  const canvasRef = useRef(null);
  const [pattern, setPattern] = useState([]);
  const [trace, setTrace] = useState([]);
  const [submittedPattern, setSubmittedPattern] = useState([]); // New state to store submitted pattern
  const MotionButton = motion.button;
  const { isMobile } = useContext(DeviceContext);
  const { isCn } = useContext(LanguageContext);

  /* draw static dots */
  const drawDots = (ctx) => {
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fill();
    });
  };

  /* animate trace (black line) */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || trace.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDots(ctx);

    let idx = 0;
    ctx.strokeStyle = '#000'; // black trace
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();

    const tick = () => {
      if (idx >= trace.length) {
        onSuccess?.([...trace]);
        return;
      }
      const curr = points.find((p) => p.id === trace[idx]);
      idx === 0 ? ctx.moveTo(curr.x, curr.y) : ctx.lineTo(curr.x, curr.y);
      ctx.stroke();
      idx++;
      requestAnimationFrame(() => setTimeout(tick, 250));
    };
    tick();
  }, [trace, onSuccess]);

  /* handlers */
  const handleNumber = (n) => setPattern((p) => (p.includes(n) ? p : [...p, n]));
  const handleClear = () => {
    setPattern([]);
    setTrace([]);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 400, 400);
      drawDots(ctx);
    }
  };
  const handleSubmit = () => {
    if (pattern.length) {
      setTrace(pattern); // Draw the pattern
      setSubmittedPattern(pattern); // Store the submitted pattern
    }
  };

  /* ---------- responsive layout ---------- */
  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3, bgcolor: '#fff' } }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row', // Change layout based on isMobile
          p: 4,
          gap: 4,
          alignItems: 'center',
        }}
      >
        {/* PATTERN CANVAS */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <StyledCanvas ref={canvasRef} width={400} height={400} />
        </Box>

        {/* BLACK DIVIDER (only for desktop) */}
        {!isMobile && <Box sx={{ width: '2px', bgcolor: '#000', alignSelf: 'stretch' }} />}

        {/* NUMBER PAD + BUTTONS */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, maxWidth: 240 }}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <MotionButton
                key={n}
                onClick={() => handleNumber(n)}
                style={{
                  aspectRatio: '1/1',
                  fontSize: 22,
                  color: '#000',
                  border: `2px solid ${pattern.includes(n) ? '#000' : '#ccc'}`, // Black border if selected, gray otherwise
                  backgroundColor: pattern.includes(n) ? '#e0e0e0' : 'white', // Slightly darker background for selected numbers
                }}
                whileHover={{
                  scale: 1.1,
                  backgroundColor: pattern.includes(n) ? '#d6d6d6' : '#f0f0f0', // Adjust hover background
                }}
              >
                {n}
              </MotionButton>
            ))}
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <MotionButton
              onClick={handleClear}
              style={{
                color: 'white',
                border: '1px solid black',
                padding: '8px 16px',
                fontSize: '12px',
              }}
              whileHover={{ scale: 1.05, textDecoration: 'underline' }}
            >
              Clear
            </MotionButton>
            <MotionButton
              onClick={handleSubmit}
              disabled={!pattern.length}
              style={{
                color: 'white',
                border: '1px solid black',
                padding: '8px 16px',
                fontSize: '12px',
              }}
              whileHover={{ scale: 1.05, textDecoration: 'underline' }}
            >
              Submit
            </MotionButton>
          </Box>

          {/* Display submitted pattern */}
          {submittedPattern.length > 0 && (
            <Box sx={{ mt: 2, fontSize: '14px', color: '#000' }}>
              Submitted Pattern: {submittedPattern.join(', ')}
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}