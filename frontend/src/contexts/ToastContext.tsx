'use client';

import React, { createContext, useContext } from 'react';
import ToastContainer from '@/components/ui/ToastContainer';
import { useToasts, ToastData } from '@/hooks/useToasts';

interface ToastContextType {
  addToast: (
    type: ToastData['type'],
    title: string,
    message?: string,
    options?: { duration?: number; persistent?: boolean }
  ) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  success: (title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => string;
  error: (title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => string;
  warning: (title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => string;
  info: (title: string, message?: string, options?: { duration?: number; persistent?: boolean }) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ 
  children, 
  position = 'top-right' 
}) => {
  const {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  } = useToasts();

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      clearAllToasts,
      success,
      error,
      warning,
      info,
    }}>
      {children}
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast} 
        position={position}
      />
    </ToastContext.Provider>
  );
};
