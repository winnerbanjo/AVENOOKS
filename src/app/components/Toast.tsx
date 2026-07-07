'use client';

import React from 'react';
import { useCart } from '../context/CartContext';

const Toast: React.FC = () => {
  const { toast } = useCart();

  if (!toast) return null;

  const getStyleClass = () => {
    switch (toast.type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success': return '✓';
      case 'error': return '⚠️';
      case 'warning': return '🔔';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`toast-notification ${getStyleClass()}`}>
      <span className="toast-icon">{getIcon()}</span>
      <div className="toast-message">{toast.message}</div>
    </div>
  );
};

export default Toast;
