import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, visitor }) {
  if (!isOpen || !visitor) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-panel modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger-text)' }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3>Delete Visitor Record</h3>
              <p className="modal-subtitle">This action permanently removes the record</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="delete-modal-content">
          <p className="delete-warning-text">
            Are you sure you want to delete the visitor entry for:
          </p>
          <div className="delete-target-preview">
            <div className="delete-target-name">{visitor.visitorName}</div>
            <div className="delete-target-meta">
              <span>{visitor.organizationName}</span> • <span>{visitor.mobileNumber}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-danger" 
            onClick={() => onConfirm(visitor._id)}
          >
            <Trash2 size={16} />
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
