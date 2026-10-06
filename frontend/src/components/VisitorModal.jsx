import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Building, Phone, Mail, User, Shield, FileText } from 'lucide-react';

const PURPOSE_OPTIONS = [
  'Client Meeting & Discussion',
  'Campus Industrial Visit',
  'Job Interview Candidate',
  'Vendor / Contractor Work',
  'Guest Lecture / Seminar',
  'Courier / Package Delivery',
  'Academic Project Review',
  'Personal Visit',
  'Other Official Purpose'
];

export default function VisitorModal({ isOpen, onClose, onSave, editingVisitor }) {
  const [formData, setFormData] = useState({
    visitorName: '',
    mobileNumber: '',
    emailAddress: '',
    organizationName: '',
    personToMeet: '',
    purposeOfVisit: PURPOSE_OPTIONS[0],
    customPurpose: '',
    dateTime: '',
    status: 'Checked In',
    idProofType: 'National ID / Aadhaar',
    idProofNumber: '',
    remarks: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prepopulate form when editing or resetting on open
  useEffect(() => {
    if (editingVisitor) {
      const isPredefined = PURPOSE_OPTIONS.includes(editingVisitor.purposeOfVisit);
      setFormData({
        visitorName: editingVisitor.visitorName || '',
        mobileNumber: editingVisitor.mobileNumber || '',
        emailAddress: editingVisitor.emailAddress || '',
        organizationName: editingVisitor.organizationName || '',
        personToMeet: editingVisitor.personToMeet || '',
        purposeOfVisit: isPredefined ? editingVisitor.purposeOfVisit : 'Other Official Purpose',
        customPurpose: isPredefined ? '' : editingVisitor.purposeOfVisit,
        dateTime: editingVisitor.dateTime 
          ? new Date(editingVisitor.dateTime).toISOString().slice(0, 16) 
          : new Date().toISOString().slice(0, 16),
        status: editingVisitor.status || 'Checked In',
        idProofType: editingVisitor.idProofType || 'National ID / Aadhaar',
        idProofNumber: editingVisitor.idProofNumber || '',
        remarks: editingVisitor.remarks || ''
      });
    } else {
      // Default new visitor form
      setFormData({
        visitorName: '',
        mobileNumber: '',
        emailAddress: '',
        organizationName: '',
        personToMeet: '',
        purposeOfVisit: PURPOSE_OPTIONS[0],
        customPurpose: '',
        dateTime: new Date().toISOString().slice(0, 16),
        status: 'Checked In',
        idProofType: 'National ID / Aadhaar',
        idProofNumber: '',
        remarks: ''
      });
    }
    setErrors({});
  }, [editingVisitor, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.visitorName.trim()) newErrors.visitorName = 'Visitor name is required';
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[0-9+\s-]{8,15}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Enter a valid mobile number (8-15 digits)';
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress.trim())) {
      newErrors.emailAddress = 'Enter a valid email address';
    }

    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization/College name is required';
    if (!formData.personToMeet.trim()) newErrors.personToMeet = 'Person to meet is required';

    if (formData.purposeOfVisit === 'Other Official Purpose' && !formData.customPurpose.trim()) {
      newErrors.customPurpose = 'Please specify the visit purpose';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const finalPurpose = formData.purposeOfVisit === 'Other Official Purpose' && formData.customPurpose.trim()
      ? formData.customPurpose.trim()
      : formData.purposeOfVisit;

    const payload = {
      ...formData,
      purposeOfVisit: finalPurpose
    };

    try {
      await onSave(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-panel modal-lg" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon">
              {editingVisitor ? <Save size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3>{editingVisitor ? 'Update Visitor Record' : 'Register New Visitor'}</h3>
              <p className="modal-subtitle">
                {editingVisitor ? 'Modify visitor details or entry status' : 'Record official visitor check-in information'}
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-sections-grid">
            
            {/* Section 1: Personal & Contact */}
            <div className="form-section">
              <h4 className="section-title">
                <User size={15} />
                <span>Visitor Information</span>
              </h4>

              <div className="form-group">
                <label>Visitor Full Name *</label>
                <input
                  type="text"
                  name="visitorName"
                  placeholder="e.g. Rahul Sen / Sarah Jenkins"
                  value={formData.visitorName}
                  onChange={handleChange}
                  className={`input-field ${errors.visitorName ? 'input-error' : ''}`}
                />
                {errors.visitorName && <span className="field-error">{errors.visitorName}</span>}
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    placeholder="e.g. +91 9876543210"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`input-field ${errors.mobileNumber ? 'input-error' : ''}`}
                  />
                  {errors.mobileNumber && <span className="field-error">{errors.mobileNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="emailAddress"
                    placeholder="e.g. visitor@company.com"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className={`input-field ${errors.emailAddress ? 'input-error' : ''}`}
                  />
                  {errors.emailAddress && <span className="field-error">{errors.emailAddress}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Organization / College Name *</label>
                <input
                  type="text"
                  name="organizationName"
                  placeholder="e.g. IIT Kharagpur / TCS / IBM Partner"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`input-field ${errors.organizationName ? 'input-error' : ''}`}
                />
                {errors.organizationName && <span className="field-error">{errors.organizationName}</span>}
              </div>
            </div>

            {/* Section 2: Visit & Security */}
            <div className="form-section">
              <h4 className="section-title">
                <Building size={15} />
                <span>Visit Details & Verification</span>
              </h4>

              <div className="form-group">
                <label>Person to Meet (Host Employee) *</label>
                <input
                  type="text"
                  name="personToMeet"
                  placeholder="e.g. Ananya Das (HR Manager / Engineering)"
                  value={formData.personToMeet}
                  onChange={handleChange}
                  className={`input-field ${errors.personToMeet ? 'input-error' : ''}`}
                />
                {errors.personToMeet && <span className="field-error">{errors.personToMeet}</span>}
              </div>

              <div className="form-group">
                <label>Purpose of Visit *</label>
                <select
                  name="purposeOfVisit"
                  value={formData.purposeOfVisit}
                  onChange={handleChange}
                  className="input-field select-field"
                >
                  {PURPOSE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {formData.purposeOfVisit === 'Other Official Purpose' && (
                <div className="form-group">
                  <label>Specify Custom Purpose *</label>
                  <input
                    type="text"
                    name="customPurpose"
                    placeholder="Describe specific purpose..."
                    value={formData.customPurpose}
                    onChange={handleChange}
                    className={`input-field ${errors.customPurpose ? 'input-error' : ''}`}
                  />
                  {errors.customPurpose && <span className="field-error">{errors.customPurpose}</span>}
                </div>
              )}

              <div className="form-row-2">
                <div className="form-group">
                  <label>Date and Time of Visit</label>
                  <input
                    type="datetime-local"
                    name="dateTime"
                    value={formData.dateTime}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="input-field select-field"
                  >
                    <option value="Checked In">Checked In</option>
                    <option value="Checked Out">Checked Out</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>ID Proof Type</label>
                  <select
                    name="idProofType"
                    value={formData.idProofType}
                    onChange={handleChange}
                    className="input-field select-field"
                  >
                    <option value="National ID / Aadhaar">National ID / Aadhaar</option>
                    <option value="College / Student ID">College / Student ID</option>
                    <option value="Employee ID">Employee ID</option>
                    <option value="Passport">Passport</option>
                    <option value="Driving License">Driving License</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>ID Proof Number (Optional)</label>
                  <input
                    type="text"
                    name="idProofNumber"
                    placeholder="e.g. ABCD-1234-XYZ"
                    value={formData.idProofNumber}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Full width remarks */}
          <div className="form-group" style={{ marginTop: '8px' }}>
            <label>Security Remarks / Gate Notes (Optional)</label>
            <input
              type="text"
              name="remarks"
              placeholder="e.g. Laptop serial registered: DELL-5521, Accompanied by team"
              value={formData.remarks}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : editingVisitor ? 'Update Record' : 'Register & Check In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
