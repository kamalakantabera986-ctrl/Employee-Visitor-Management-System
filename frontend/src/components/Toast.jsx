import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className={`toast-container ${toast.type}`}>
      <div className="toast-icon">
        {isSuccess && <CheckCircle2 size={18} style={{ color: '#34d399' }} />}
        {isError && <AlertCircle size={18} style={{ color: '#f87171' }} />}
        {!isSuccess && !isError && <Info size={18} style={{ color: '#60a5fa' }} />}
      </div>
      <div className="toast-message">{toast.message}</div>
      <button className="toast-close-btn" onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}
