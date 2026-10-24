"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { PatternAuth } from '@/utils/patternAuth';
import useFont from '@/hooks/useFont';

/* ----------  bilingual copy  ---------- */
const lockI18n = {
  en: {
    title: 'REQUIRE PATTERN AUTHENTICATION',
    tip: 'Connect minimum 6 points',
    clear: 'CLEAR',
    unlock: 'UNLOCK',
    incorrect: 'INCORRECT PATTERN',
    success: 'ACCESS GRANTED',
    tooShort: 'MINIMUM 4 POINTS REQUIRED',
  },
  cn: {
    title: '要求图案认证',
    tip: '至少连接 6 个点',
    clear: '清除',
    unlock: '解锁',
    incorrect: '图案错误',
    success: '访问已授权',
    tooShort: '至少需要 4 个点',
  },
};

export default function PatternLock({ onSuccess }) {
  const canvasRef = useRef(null);
  const [selected, setSelected] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoint, setCur] = useState(null);
  const [alertConfig, setAlertConfig] = useState({ open: false, severity: 'error', message: '' });
  const [isValidating, setIsValidating] = useState(false);
  const [isCn] = useState(false);
  const [mounted, setMounted] = useState(false);

  const t = lockI18n[isCn ? 'cn' : 'en'];
  const { contentFontFamily, contentTitleFontFamily, buttonFontFamily } = useFont();

  const POINT_RADIUS = 22;
  const ACTIVE_POINT_RADIUS = 6;
  const LINE_WIDTH = 2.5;
  const CANVAS_SIZE = 320;
  const GRID_SIZE = 3;
  const POINT_SPACING = CANVAS_SIZE / (GRID_SIZE + 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const points = React.useMemo(() => {
    const arr = [];
    let id = 1;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        arr.push({ x: POINT_SPACING * (col + 1), y: POINT_SPACING * (row + 1), id: id++ });
      }
    }
    return arr;
  }, []);

  /* ----------  canvas render ---------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_SIZE * dpr;
    canvas.height = CANVAS_SIZE * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    /* lines */
    if (selected.length) {
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'square';
      ctx.lineJoin = 'miter';
      ctx.beginPath();
      selected.forEach((id, i) => {
        const p = points.find((v) => v.id === id);
        if (p) {
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
      });
      if (isDrawing && currentPoint) ctx.lineTo(currentPoint.x, currentPoint.y);
      ctx.stroke();
    }

    /* points */
    points.forEach((p) => {
      const active = selected.includes(p.id);
      
      // Outer square (Bauhaus style)
      const squareSize = POINT_RADIUS * 1.6;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(p.x - squareSize / 2, p.y - squareSize / 2, squareSize, squareSize);
      
      // Inner circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = active ? '#000000' : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      
      if (active) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, ACTIVE_POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      }
    });
  }, [selected, currentPoint, isDrawing, points]);

  /* ----------  coordinate helpers ---------- */
  const getCanvasCoordinates = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const getPoint = (clientX, clientY) => {
    const coords = getCanvasCoordinates(clientX, clientY);
    if (!coords) return null;
    return points.find((p) => Math.hypot(coords.x - p.x, coords.y - p.y) <= POINT_RADIUS + 5) || null;
  };

  /* ----------  validation ---------- */
  const validatePattern = (pattern) => {
    const deduped = [...new Set(pattern)];
    if (deduped.length < 4) return { valid: false, message: t.tooShort, severity: 'warning' };
    const ok = PatternAuth.validatePattern(deduped);
    return ok
      ? { valid: true, message: t.success, severity: 'success' }
      : { valid: false, message: t.incorrect, severity: 'error' };
  };

  const validateAndHandlePattern = (pattern) => {
    if (isValidating) return;
    setIsValidating(true);
    const res = validatePattern(pattern);

    setAlertConfig({ open: true, severity: res.severity, message: res.message });

    if (res.valid) {
      setTimeout(() => {
        setAlertConfig({ open: false, severity: 'error', message: '' });
        setIsValidating(false);
        if (onSuccess) onSuccess(pattern);
      }, 1200);
    } else {
      setTimeout(() => {
        setSelected([]);
        setAlertConfig({ open: false, severity: 'error', message: '' });
        setIsValidating(false);
      }, 2000);
    }
  };

  /* ----------  event handlers ---------- */
  const handleStart = (clientX, clientY) => {
    if (isValidating) return;
    setIsDrawing(true);
    const p = getPoint(clientX, clientY);
    if (p) setSelected([p.id]);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDrawing || isValidating) return;
    const coords = getCanvasCoordinates(clientX, clientY);
    if (coords) setCur(coords);
    const p = getPoint(clientX, clientY);
    if (p && !selected.includes(p.id)) setSelected((s) => [...s, p.id]);
  };

  const handleEnd = () => {
    if (!isDrawing || isValidating) return;
    setIsDrawing(false);
    setCur(null);
    if (selected.length) validateAndHandlePattern(selected);
  };

  /* ----------  mouse / touch ---------- */
  const handleMouseDown = (e) => handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();
  const handleTouchStart = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleStart(t.clientX, t.clientY);
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  };
  const handleTouchEnd = (e) => {
    e.preventDefault();
    handleEnd();
  };

  const handleClear = () => {
    if (isValidating) return;
    setSelected([]);
    setAlertConfig({ open: false, severity: 'error', message: '' });
  };

  /* ----------  animation variants ---------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  /* ----------  render ---------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <motion.div
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        variants={containerVariants}
        className="w-full max-w-sm"
      >
        {/* Header */}
        <motion.div variants={headerVariants} className="mb-6 text-center">
          <motion.h1
            variants={itemVariants}
            className="text-xl font-bold tracking-wider mb-1"
            style={{ fontFamily: contentTitleFontFamily, letterSpacing: '0.1em' }}
          >
            {t.title}
          </motion.h1>

        </motion.div>

        {/* Alert */}
        <AnimatePresence mode="wait">
          {alertConfig.open && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                exit={{ x: 20 }}
                transition={{ duration: 0.3 }}
                className={`border-4 p-4 flex items-center justify-center gap-3 font-bold tracking-wider text-sm ${
                  alertConfig.severity === 'success'
                    ? 'bg-black text-white border-black'
                    : alertConfig.severity === 'warning'
                    ? 'bg-white text-black border-black'
                    : 'bg-white text-black border-black'
                }`}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  {alertConfig.severity === 'success' ? (
                    <CheckCircle size={24} />
                  ) : (
                    <XCircle size={24} />
                  )}
                </motion.div>
                <span style={{ fontFamily: contentFontFamily }}>{alertConfig.message}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Canvas */}
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <canvas
              ref={canvasRef}
              className="border-4 border-black bg-white cursor-pointer touch-none w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              style={{ aspectRatio: '1/1' }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            />
          </motion.div>
        </motion.div>

        {/* Buttons */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
          <motion.button
            onClick={handleClear}
            disabled={isValidating}
            whileHover={{ scale: isValidating ? 1 : 1.02, x: -2, y: -2 }}
            whileTap={{ scale: isValidating ? 1 : 0.98 }}
            transition={{ duration: 0.2 }}
            className="relative py-3 border-4 border-black bg-white text-black font-bold tracking-wider text-sm transition-all disabled:opacity-30 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]"
            style={{ fontFamily: buttonFontFamily }}
          >
            {t.clear}
          </motion.button>

          <motion.button
            onClick={() => validateAndHandlePattern(selected)}
            disabled={selected.length < 4 || isValidating}
            whileHover={{
              scale: selected.length >= 4 && !isValidating ? 1.02 : 1,
              x: selected.length >= 4 && !isValidating ? -2 : 0,
              y: selected.length >= 4 && !isValidating ? -2 : 0
            }}
            whileTap={{ scale: selected.length >= 4 && !isValidating ? 0.98 : 1 }}
            transition={{ duration: 0.2 }}
            className={`relative py-3 border-4 font-bold tracking-wider text-sm transition-all ${
              selected.length >= 4 && !isValidating
                ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-white text-black border-black opacity-30 cursor-not-allowed'
            }`}
            style={{ fontFamily: buttonFontFamily }}
          >
            {t.unlock}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}