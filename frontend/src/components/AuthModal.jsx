import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Sparkles, Mail, Lock, User, Building } from 'lucide-react';
import { authAPI } from '../utils/api';

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onAuthSuccess, onShowToast }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'signup'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Receptionist',
    department: 'Front Desk / Security'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrorMessage('');
  };

  const handleFillDemo = async () => {
    try {
      setIsSubmitting(true);
      const res = await authAPI.seedDemo();
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onShowToast(`Signed in as demo ${res.user.role}!`, 'success');
      onClose();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to authenticate demo user');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      let res;
      if (mode === 'login') {
        res = await authAPI.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        res = await authAPI.signup(formData);
      }

      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      onAuthSuccess(res.user);
      onShowToast(mode === 'login' ? 'Successfully signed in!' : 'Account registered successfully!', 'success');
      onClose();
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 
        err.response?.data?.error || 
        'Authentication failed. Please verify credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box glass-panel modal-auth" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-header-icon" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8' }}>
              {mode === 'login' ? <LogIn size={20} /> : <UserPlus size={20} />}
            </div>
            <div>
              <h3>{mode === 'login' ? 'Staff Sign In' : 'Create Staff Account'}</h3>
              <p className="modal-subtitle">
                {mode === 'login' 
                  ? 'Access receptionist & administrative controls' 
                  : 'Register a new receptionist or security officer profile'}
              </p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="auth-tab-switcher">
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => { setMode('login'); setErrorMessage(''); }}
          >
            <LogIn size={15} />
            <span>Sign In</span>
          </button>
          <button 
            type="button" 
            className={`auth-tab-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => { setMode('signup'); setErrorMessage(''); }}
          >
            <UserPlus size={15} />
            <span>Sign Up</span>
          </button>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="demo-credentials-card">
          <div className="demo-text">
            <strong>Evaluation Demo Account:</strong>
            <code>admin@ibm-visit.com</code> • <code>adminpassword123</code>
          </div>
          <button 
            type="button" 
            className="btn btn-outline btn-sm demo-fast-btn" 
            onClick={handleFillDemo}
            disabled={isSubmitting}
          >
            <Sparkles size={13} />
            <span>1-Click Demo Login</span>
          </button>
        </div>

        {/* Error message notice */}
        {errorMessage && (
          <div className="auth-error-banner">
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <div className="input-with-icon">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Priyanshu Roy"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Staff Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="input-field select-field"
                  >
                    <option value="Receptionist">Receptionist</option>
                    <option value="Admin">Admin</option>
                    <option value="Security Officer">Security Officer</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Front Office"
                    value={formData.department}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Work Email Address *</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@organization.com"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password *</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••••••"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '16px 0 0 0' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ flex: 1 }}>
              {isSubmitting 
                ? 'Processing...' 
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
