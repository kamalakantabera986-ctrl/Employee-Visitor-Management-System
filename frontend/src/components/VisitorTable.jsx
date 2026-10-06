import React from 'react';
import { 
  Edit3, 
  Trash2, 
  IdCard, 
  CheckCircle2, 
  LogOut, 
  Phone, 
  Mail, 
  Building2, 
  UserCheck, 
  Calendar,
  Clock,
  Sparkles
} from 'lucide-react';

export default function VisitorTable({ 
  visitors, 
  isLoading, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  onViewBadge,
  onAddNew
}) {
  // Format readable date and time
  const formatDateTime = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeOnly = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  if (isLoading) {
    return (
      <div className="table-card glass-panel loading-container">
        <div className="loading-spinner"></div>
        <p>Loading visitor records from MongoDB Atlas...</p>
      </div>
    );
  }

  if (visitors.length === 0) {
    return (
      <div className="table-card glass-panel empty-state">
        <div className="empty-icon-box">
          <Sparkles size={36} style={{ color: '#818cf8' }} />
        </div>
        <h3>No Visitor Records Found</h3>
        <p>No matching visitors were found for your current filter or search criteria.</p>
        <button className="btn btn-primary btn-sm" onClick={onAddNew} style={{ marginTop: '16px' }}>
          + Register New Visitor
        </button>
      </div>
    );
  }

  return (
    <div className="table-card glass-panel">
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Visitor Details</th>
              <th>Contact Info</th>
              <th>Organization</th>
              <th>Host (Person to Meet)</th>
              <th>Purpose of Visit</th>
              <th>Check-In Time</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Pass & Quick Action</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((visitor) => {
              const isCheckedIn = visitor.status === 'Checked In';
              return (
                <tr key={visitor._id} className="table-row-hover">
                  {/* Visitor Details */}
                  <td>
                    <div className="visitor-meta-cell">
                      <div className="visitor-avatar">
                        {visitor.visitorName ? visitor.visitorName.charAt(0).toUpperCase() : 'V'}
                      </div>
                      <div>
                        <span className="visitor-primary-name">{visitor.visitorName}</span>
                        <div className="visitor-badge-code">
                          <span>{visitor.badgeNumber || 'VIS-PASS'}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Contact Info */}
                  <td>
                    <div className="contact-meta-cell">
                      <div className="contact-row">
                        <Phone size={13} className="cell-icon" />
                        <span>{visitor.mobileNumber}</span>
                      </div>
                      <div className="contact-row sub-row">
                        <Mail size={13} className="cell-icon" />
                        <span>{visitor.emailAddress}</span>
                      </div>
                    </div>
                  </td>

                  {/* Organization */}
                  <td>
                    <div className="org-meta-cell">
                      <Building2 size={14} className="cell-icon" />
                      <span>{visitor.organizationName}</span>
                    </div>
                  </td>

                  {/* Person to Meet */}
                  <td>
                    <div className="host-meta-cell">
                      <UserCheck size={14} className="cell-icon" />
                      <span>{visitor.personToMeet}</span>
                    </div>
                  </td>

                  {/* Purpose */}
                  <td>
                    <span className="purpose-tag">{visitor.purposeOfVisit}</span>
                  </td>

                  {/* Date & Time */}
                  <td>
                    <div className="datetime-meta-cell">
                      <div className="datetime-row">
                        <Calendar size={13} className="cell-icon" />
                        <span>{formatDateTime(visitor.dateTime)}</span>
                      </div>
                      {visitor.checkOutTime && (
                        <div className="datetime-row sub-row checkout-time-note">
                          <Clock size={12} className="cell-icon" />
                          <span>Out: {formatTimeOnly(visitor.checkOutTime)}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td>
                    <span className={`status-badge ${isCheckedIn ? 'status-in' : 'status-out'}`}>
                      {isCheckedIn && <span className="pulse-dot"></span>}
                      {visitor.status}
                    </span>
                  </td>

                  {/* Pass & Quick Action */}
                  <td style={{ textAlign: 'center' }}>
                    <div className="quick-actions-bar">
                      <button 
                        className="btn btn-outline btn-sm action-pill-btn"
                        onClick={() => onViewBadge(visitor)}
                        title="View & Print Visitor ID Badge"
                      >
                        <IdCard size={14} />
                        <span>Badge Pass</span>
                      </button>

                      <button 
                        className={`btn btn-sm action-pill-btn ${isCheckedIn ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => onToggleStatus(visitor._id, isCheckedIn ? 'Checked Out' : 'Checked In')}
                        title={isCheckedIn ? 'Click to Check Out visitor' : 'Click to Re-Check In visitor'}
                      >
                        {isCheckedIn ? (
                          <>
                            <LogOut size={13} />
                            <span>Check Out</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} />
                            <span>Check In</span>
                          </>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Edit & Delete Action Buttons */}
                  <td style={{ textAlign: 'right' }}>
                    <div className="row-action-buttons">
                      <button 
                        className="btn btn-secondary btn-icon" 
                        onClick={() => onEdit(visitor)}
                        title="Edit Visitor Details"
                      >
                        <Edit3 size={15} style={{ color: '#818cf8' }} />
                      </button>
                      <button 
                        className="btn btn-secondary btn-icon delete-btn-hover" 
                        onClick={() => onDelete(visitor)}
                        title="Delete Visitor Record"
                      >
                        <Trash2 size={15} style={{ color: '#f87171' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
