// hooks/useAsyncAction.js
import { useRef, useCallback, useEffect, useState } from 'react';

export function useAsyncAction(asyncFn, options = {}) {
  const { throttleMs = 800, onSuccess, onError } = options;

  const isMountedRef = useRef(true);
  const isExecutingRef = useRef(false);
  const requestIdRef = useRef(0);
  const lastClickAtRef = useRef(0);

  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const resetError = useCallback(() => setError(null), []);

  const execute = useCallback(
    async (...args) => {
      // 1. 节流检查（手动点击触发时）
      const now = Date.now();
      if (now - lastClickAtRef.current < throttleMs) return;
      // 2. 并发检查
      if (isExecutingRef.current) return;

      lastClickAtRef.current = now;
      isExecutingRef.current = true;
      setIsExecuting(true);
      setError(null);

      const requestId = ++requestIdRef.current;

      try {
        const result = await asyncFn(...args);

        // 只有最新请求且组件仍然挂载才应用结果
        if (requestId !== requestIdRef.current) return;
        if (!isMountedRef.current) return;

        onSuccess?.(result);
        return result;
      } catch (err) {
        if (requestId === requestIdRef.current && isMountedRef.current) {
          setError(err);
          onError?.(err);
        }
        // 如果不是最新请求，错误不抛出，也不影响 UI
      } finally {
        // 只有最新请求才能释放锁
        if (requestId === requestIdRef.current) {
          isExecutingRef.current = false;
        }
        if (isMountedRef.current) {
          setIsExecuting(false);
        }
      }
    },
    [asyncFn, throttleMs, onSuccess, onError]
  );

  return { execute, isExecuting, error, resetError };
}