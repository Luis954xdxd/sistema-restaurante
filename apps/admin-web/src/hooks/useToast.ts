import { useCallback, useRef, useState } from 'react';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error';
  text: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const timeoutMap = useRef<Record<number, number>>({});

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

    const timeoutId = timeoutMap.current[id];
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete timeoutMap.current[id];
    }
  }, []);

  const showToast = useCallback(
    (type: 'success' | 'error', text: string) => {
      const id = Date.now() + Math.floor(Math.random() * 1000);

      setToasts((prev) => [...prev, { id, type, text }]);

      timeoutMap.current[id] = window.setTimeout(() => {
        removeToast(id);
      }, 4200);
    },
    [removeToast]
  );

  return {
    toasts,
    showToast,
    removeToast,
  };
}