import React from 'react';
import { X, Printer, ShieldCheck, Building2, UserCheck, Calendar, QrCode } from 'lucide-react';

export default function VisitorBadgeModal({ isOpen, onClose, visitor }) {
  if (!isOpen || !visitor) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(visitor.dateTime).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-panel modal-sm" onClick={e => e.stopPropagation()}>
        <div className="modal-header no-print">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              <ShieldCheck size={20} />
            </div>
            <div>
              <h3>Official Visitor Pass</h3>
              <p className="modal-subtitle">Ready for on-premises verification & printing</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Printable Badge Card */}
        <div id="printable-badge" className="visitor-badge-card">
          <div className="badge-card-header">
            <div className="badge-header-left">
              <span className="badge-org-name">IBM INDUSTRIAL FACILITY</span>
              <span className="badge-type">OFFICIAL VISITOR PASS</span>
            </div>
            <div className="badge-header-right">
              <span className="badge-number-tag">{visitor.badgeNumber || 'VIS-PASS'}</span>
            </div>
          </div>

          <div className="badge-card-body">
            <div className="badge-avatar-row">
              <div className="badge-avatar">
                {visitor.visitorName ? visitor.visitorName.charAt(0).toUpperCase() : 'V'}
              </div>
              <div className="badge-name-block">
                <h2 className="badge-visitor-name">{visitor.visitorName}</h2>
                <p className="badge-visitor-org">{visitor.organizationName}</p>
              </div>
            </div>

            <div className="badge-details-grid">
              <div className="badge-detail-item">
                <span className="badge-item-label">Host / Meet</span>
                <span className="badge-item-val">{visitor.personToMeet}</span>
              </div>
              <div className="badge-detail-item">
                <span className="badge-item-label">Purpose</span>
                <span className="badge-item-val">{visitor.purposeOfVisit}</span>
              </div>
              <div className="badge-detail-item">
                <span className="badge-item-label">Mobile</span>
                <span className="badge-item-val">{visitor.mobileNumber}</span>
              </div>
              <div className="badge-detail-item">
                <span className="badge-item-label">Check-In Time</span>
                <span className="badge-item-val">{formattedDate}</span>
              </div>
            </div>

            <div className="badge-footer-row">
              <div className="badge-qr-placeholder">
                <QrCode size={42} />
                <span className="qr-code-text">VERIFIED</span>
              </div>
              <div className="badge-status-side">
                <span className={`status-badge ${visitor.status === 'Checked In' ? 'status-in' : 'status-out'}`}>
                  {visitor.status}
                </span>
                <span className="badge-security-note">Please return this pass at reception</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="modal-footer no-print">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Visitor Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}
