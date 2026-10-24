"use client";
import { useState, useRef, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { LanguageContext } from '@/components/contexts/LanguageContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/material/styles';

/* ----------  bilingual copy  ---------- */
export const lockI18n = {
  en: {
    title: 'Draw Pattern',
    tip: 'Connect at least 4 points to unlock',
    clear: 'Clear',
    unlock: 'Unlock',
  },
  cn: {
    title: '绘制解锁图案',
    tip: '至少连接 4 个点以解锁',
    clear: '清除',
    unlock: '解锁',
  },
};

/* ----------  NEW: the secret 6-dot password  ---------- */
const SECRET = [1, 2, 3, 4, 5, 6];

/* ----------  helper: deep-equal for arrays  ---------- */
const samePattern = (a: number[], b: number[]) =>
  a.length === b.length && a.every((v, i) => v === b[i]);

const StyledCanvas = styled('canvas')(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'white',
  boxShadow: theme.shadows[3],
  cursor: 'pointer',
  touchAction: 'none',
  minWidth: '400px',
  minHeight: '400px',
  [theme.breakpoints.down('sm')]: {
    minWidth: '300px',
    minHeight: '300px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  minWidth: '100px',
  margin: theme.spacing(1),
  borderRadius: '10px',
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: 'white',
  color: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },
}));

export default function PatternLock({ onSuccess, onClose }: {
  onSuccess: (pattern: number[]) => void;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoint, setCur] = useState<{ x: number; y: number } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  const { isCn } = useContext(LanguageContext);
  const t = lockI18n[isCn ? 'cn' : 'en'];

  const MotionButton = motion(StyledButton);

  const points = [
    { x: 100, y: 100, id: 1 },
    { x: 200, y: 100, id: 2 },
    { x: 300, y: 100, id: 3 },
    { x: 100, y: 200, id: 4 },
    { x: 200, y: 200, id: 5 },
    { x: 300, y: 200, id: 6 },
    { x: 100, y: 300, id: 7 },
    { x: 200, y: 300, id: 8 },
    { x: 300, y: 300, id: 9 },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* ----------------------------------------------------
     * 1.  draw the 9 static dots
     * -------------------------------------------------- */
    points.forEach((p) => {
      const active = selected.includes(p.id);
      const over = hovered === p.id;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 25, 0, Math.PI * 2);
      ctx.fillStyle = active ? '#1976d2' : over ? '#64b5f6' : '#1976d2';
      ctx.fill();
      ctx.strokeStyle = '#1976d2';
      ctx.lineWidth = 2;
      ctx.stroke();
      if (active) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    });

    /* ----------------------------------------------------
     * 2.  draw the trace (live or final)
     * -------------------------------------------------- */
    if (selected.length) {
      const isMatched = !isDrawing && samePattern(selected, SECRET);
      ctx.strokeStyle = isMatched ? '#ffc107' : '#1976d2';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      selected.forEach((id, i) => {
        const P = points.find((v) => v.id === id)!;
        i ? ctx.lineTo(P.x, P.y) : ctx.moveTo(P.x, P.y);
      });
      if (isDrawing && currentPoint) ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }
  }, [selected, currentPoint, hovered, isDrawing]);

  const getPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    const mx = (x - rect.left) * sx;
    const my = (y - rect.top) * sy;
    return points.find((p) => Math.hypot(mx - p.x, my - p.y) <= 30) ?? null;
  };

  const handleDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const p = getPoint(e.clientX, e.clientY);
    if (p) {
      setSelected([p.id]);
      setHovered(p.id);
    }
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    setCur({ x: (e.clientX - rect.left) * sx, y: (e.clientY - rect.top) * sy });
    const p = getPoint(e.clientX, e.clientY);
    if (p && !selected.includes(p.id)) {
      setSelected([...selected, p.id]);
      setHovered(p.id);
    }
  };

  const handleUp = () => {
    setIsDrawing(false);
    setCur(null);
    setHovered(null);
    if (samePattern(selected, SECRET)) {
      onSuccess([...selected]);
    } else {
      setSelected([]);
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.95)' },
      }}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          {t.title}
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
          {t.tip}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <StyledCanvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={handleDown}
            onMouseMove={handleMove}
            onMouseUp={handleUp}
            onMouseLeave={handleUp}
          />
        </Box>

        <DialogActions sx={{ justifyContent: 'center', p: 0, gap: 2 }}>
          <MotionButton
            onClick={() => setSelected([])}
            variant="outlined"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.clear}
          </MotionButton>

          <MotionButton
            onClick={() => samePattern(selected, SECRET) && onSuccess([...selected])}
            variant="contained"
            disabled={!samePattern(selected, SECRET)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            sx={{
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark' },
              '&.Mui-disabled': { backgroundColor: 'grey.300', color: 'grey.500' },
            }}
          >
            {t.unlock}
          </MotionButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}