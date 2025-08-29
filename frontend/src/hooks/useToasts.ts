import { useState, useCallback } from 'react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
}

export const useToasts = () => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((
    type: ToastData['type'],
    title: string,
    message?: string,
    options?: {
      duration?: number;
      persistent?: boolean;
    }
  ) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastData = {
      id,
      type,
      title,
      message,
      duration: options?.duration ?? 5000,
      persistent: options?.persistent ?? false,
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Métodos de conveniência
  const success = useCallback((title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => {
    return addToast('success', title, message, options);
  }, [addToast]);

  const error = useCallback((title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => {
    return addToast('error', title, message, options);
  }, [addToast]);

  const warning = useCallback((title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => {
    return addToast('warning', title, message, options);
  }, [addToast]);

  const info = useCallback((title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => {
    return addToast('info', title, message, options);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };
};

export default useToasts;
