'use client'

import React, { useEffect, useRef } from 'react'
import { useAsyncAction } from '@/hooks/useAsyncAction'

export function DotMenu({ dot, x, y, color, onClose, throttleMs = 300 }) {
  const ref = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  // 使用 useAsyncAction 包装菜单项点击，防止快速重复触发
  const { execute, isExecuting } = useAsyncAction(
    async (clickFn) => {
      // 执行用户传入的点击回调（如果有）
      clickFn?.()
      // 关闭菜单
      onClose()
    },
    { throttleMs }
  )

  if (!dot.menu?.length && !dot.label) return null

  return (
    <div
      ref={ref}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: -10,
        zIndex: 100,
        background: 'var(--pattern-menu-bg, rgba(10,10,10,0.92))',
        border: `1px solid ${color}44`,
        borderRadius: 8,
        padding: '6px 0',
        minWidth: 140,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: `0 4px 24px ${color}22, 0 1px 6px rgba(0,0,0,0.3)`,
        pointerEvents: 'all',
      }}
    >
      {dot.label && (
        <div
          style={{
            padding: '4px 14px 6px',
            fontSize: 11,
            fontWeight: 600,
            color: color,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            borderBottom: `0.5px solid ${color}33`,
            marginBottom: 4,
          }}
        >
          {dot.label}
        </div>
      )}
      {dot.menu?.map((item, i) => (
        <a
          key={i}
          href={item.href || undefined}
          onClick={(e) => {
            if (!item.href) e.preventDefault()
            // 使用节流执行：传入 item.onClick，由 useAsyncAction 控制调用和关闭
            execute(() => item.onClick?.())
          }}
          style={{
            display: 'block',
            padding: '6px 14px',
            fontSize: 13,
            color: 'rgba(255,255,255,0.85)',
            textDecoration: 'none',
            cursor: isExecuting ? 'not-allowed' : 'pointer',
            transition: 'background 0.12s, color 0.12s',
            opacity: isExecuting ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `${color}22`
            e.currentTarget.style.color = '#fff'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'rgba(255,255,255,0.85)'
          }}
        >
          {item.label}
        </a>
      ))}
    </div>
  )
}