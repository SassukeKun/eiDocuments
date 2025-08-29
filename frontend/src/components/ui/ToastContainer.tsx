'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import Toast, { ToastData } from './Toast';

interface ToastContainerProps {
  toasts: ToastData[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onRemove, 
  position = 'top-right' 
}) => {
  if (typeof window === 'undefined') return null;

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className={`
        fixed z-50 flex flex-col pointer-events-none
        ${getPositionClasses()}
      `}
      style={{ maxHeight: 'calc(100vh - 2rem)' }}
    >
      <div className="flex flex-col space-y-2 pointer-events-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            toast={toast}
            onClose={onRemove}
          />
        ))}
      </div>
    </div>,
    document.body
  );
};

export default ToastContainer;
