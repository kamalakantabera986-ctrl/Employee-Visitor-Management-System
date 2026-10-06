import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import VisitorTable from './components/VisitorTable';
import VisitorModal from './components/VisitorModal';
import VisitorBadgeModal from './components/VisitorBadgeModal';
import AuthModal from './components/AuthModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { visitorAPI, authAPI } from './utils/api';
import { 
  Search, 
  X, 
  UserPlus, 
  Download, 
  RotateCw, 
  Filter 
} from 'lucide-react';
import './App.css';

export default function App() {
  // Visitor Data & Filters
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, checkedOut: 0, todayVisits: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(true);

  // Authentication state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Modals state
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [editingVisitor, setEditingVisitor] = useState(null);

  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [selectedBadgeVisitor, setSelectedBadgeVisitor] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDeleteVisitor, setSelectedDeleteVisitor] = useState(null);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  // Toast notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch visitors list with current search and filters
  const fetchVisitors = useCallback(async (searchQuery = search, status = statusFilter, purpose = purposeFilter) => {
    setIsLoading(true);
    try {
      const data = await visitorAPI.getVisitors({
        search: searchQuery,
        status: status,
        purpose: purpose
      });
      setVisitors(data);
    } catch (err) {
      console.error('Error fetching visitors:', err);
      showToast('Could not load visitors. Please verify server connection.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter, purposeFilter]);

  // Fetch KPI stats
  const fetchStats = async () => {
    try {
      const data = await visitorAPI.getStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchVisitors(search, statusFilter, purposeFilter);
    fetchStats();
  }, [statusFilter, purposeFilter]);

  // Handle Search Input with Debounce
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchVisitors(search, statusFilter, purposeFilter);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Add or Edit Visitor handler
  const handleSaveVisitor = async (visitorData) => {
    try {
      if (editingVisitor) {
        await visitorAPI.updateVisitor(editingVisitor._id, visitorData);
        showToast(`Visitor ${visitorData.visitorName} updated successfully!`, 'success');
      } else {
        const created = await visitorAPI.createVisitor(visitorData);
        showToast(`Visitor ${created.visitorName} checked in with Badge: ${created.badgeNumber}!`, 'success');
      }
      setIsVisitorModalOpen(false);
      setEditingVisitor(null);
      fetchVisitors();
      fetchStats();
    } catch (err) {
      console.error('Error saving visitor:', err);
      showToast(err.response?.data?.error || 'Failed to save visitor record', 'error');
      throw err;
    }
  };

  // Quick toggle status (Checked In <-> Checked Out)
  const handleToggleStatus = async (id, newStatus) => {
    try {
      await visitorAPI.updateStatus(id, newStatus);
      showToast(`Status updated to "${newStatus}"`, 'success');
      fetchVisitors();
      fetchStats();
    } catch (err) {
      console.error('Error updating status:', err);
      showToast('Failed to update status', 'error');
    }
  };

  // Delete visitor confirmation & execution
  const handleConfirmDelete = async (id) => {
    try {
      await visitorAPI.deleteVisitor(id);
      showToast('Visitor record deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setSelectedDeleteVisitor(null);
      fetchVisitors();
      fetchStats();
    } catch (err) {
      console.error('Error deleting visitor:', err);
      showToast('Failed to delete visitor record', 'error');
    }
  };

  // Export current table records to CSV
  const handleExportCSV = () => {
    if (visitors.length === 0) {
      showToast('No records to export', 'error');
      return;
    }

    const headers = [
      'Badge Number',
      'Visitor Name',
      'Mobile Number',
      'Email Address',
      'Organization/College',
      'Person To Meet',
      'Purpose Of Visit',
      'Date & Time',
      'Check-Out Time',
      'Status',
      'ID Proof Type',
      'Remarks'
    ];

    const rows = visitors.map(v => [
      `"${v.badgeNumber || ''}"`,
      `"${v.visitorName || ''}"`,
      `"${v.mobileNumber || ''}"`,
      `"${v.emailAddress || ''}"`,
      `"${v.organizationName || ''}"`,
      `"${v.personToMeet || ''}"`,
      `"${v.purposeOfVisit || ''}"`,
      `"${v.dateTime ? new Date(v.dateTime).toLocaleString() : ''}"`,
      `"${v.checkOutTime ? new Date(v.checkOutTime).toLocaleString() : ''}"`,
      `"${v.status || ''}"`,
      `"${v.idProofType || ''}"`,
      `"${(v.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Visitor_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Visitor records exported to CSV!', 'success');
  };

  // 1-Click Demo Login
  const handleQuickDemoLogin = async () => {
    try {
      const res = await authAPI.seedDemo();
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      setUser(res.user);
      showToast(`Logged in as ${res.user.name} (${res.user.role})!`, 'success');
    } catch (err) {
      console.error('Demo login failed:', err);
      showToast('Could not sign in demo user', 'error');
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Signed out successfully', 'info');
  };

  return (
    <div className="app-wrapper">
      {/* Top Navbar */}
      <Navbar 
        user={user}
        onOpenAuth={(mode) => { setAuthMode(mode); setIsAuthModalOpen(true); }}
        onLogout={handleLogout}
        onQuickDemo={handleQuickDemoLogin}
      />

      {/* KPI Overview Cards */}
      <StatsOverview stats={stats} />

      {/* Action and Filter Control Bar */}
      <section className="action-bar-container glass-panel">
        <div className="action-bar-top">
          {/* Real-time Search Box */}
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text"
              id="visitor-search-input"
              placeholder="Search visitors by name or mobile number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button 
                className="search-clear-btn" 
                onClick={() => setSearch('')}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Quick Buttons */}
          <div className="action-bar-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => { fetchVisitors(); fetchStats(); }}
              title="Refresh visitor logs"
            >
              <RotateCw size={14} />
              <span>Refresh</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleExportCSV}
              title="Export current table to CSV file"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button 
              id="btn-add-visitor"
              className="btn btn-primary"
              onClick={() => {
                setEditingVisitor(null);
                setIsVisitorModalOpen(true);
              }}
            >
              <UserPlus size={16} />
              <span>Register New Visitor</span>
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="action-bar-bottom">
          <div className="filter-pills-group">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={13} /> Status:
            </span>
            {['All', 'Checked In', 'Checked Out'].map((st) => (
              <button 
                key={st}
                className={`filter-pill ${statusFilter === st ? 'active' : ''}`}
                onClick={() => setStatusFilter(st)}
              >
                {st === 'Checked In' && <span className="pulse-dot"></span>}
                {st}
                <span style={{ opacity: 0.7, fontSize: '0.7rem' }}>
                  ({st === 'All' ? stats.total : st === 'Checked In' ? stats.checkedIn : stats.checkedOut})
                </span>
              </button>
            ))}
          </div>

          <div className="filter-dropdowns-group">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Purpose:</span>
            <select 
              value={purposeFilter}
              onChange={(e) => setPurposeFilter(e.target.value)}
              className="custom-select"
            >
              <option value="All">All Purposes</option>
              <option value="Client Meeting & Discussion">Client Meeting</option>
              <option value="Campus Industrial Visit">Campus Industrial Visit</option>
              <option value="Job Interview Candidate">Job Interview</option>
              <option value="Vendor / Contractor Work">Vendor / Contractor</option>
              <option value="Guest Lecture / Seminar">Guest Lecture</option>
              <option value="Courier / Package Delivery">Delivery</option>
              <option value="Academic Project Review">Academic Project</option>
              <option value="Personal Visit">Personal Visit</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Visitor Records Table */}
      <VisitorTable 
        visitors={visitors}
        isLoading={isLoading}
        onEdit={(visitor) => {
          setEditingVisitor(visitor);
          setIsVisitorModalOpen(true);
        }}
        onDelete={(visitor) => {
          setSelectedDeleteVisitor(visitor);
          setIsDeleteModalOpen(true);
        }}
        onToggleStatus={handleToggleStatus}
        onViewBadge={(visitor) => {
          setSelectedBadgeVisitor(visitor);
          setIsBadgeModalOpen(true);
        }}
        onAddNew={() => {
          setEditingVisitor(null);
          setIsVisitorModalOpen(true);
        }}
      />

      {/* Modal: Add or Edit Visitor */}
      <VisitorModal 
        isOpen={isVisitorModalOpen}
        editingVisitor={editingVisitor}
        onClose={() => {
          setIsVisitorModalOpen(false);
          setEditingVisitor(null);
        }}
        onSave={handleSaveVisitor}
      />

      {/* Modal: View & Print Visitor Badge */}
      <VisitorBadgeModal 
        isOpen={isBadgeModalOpen}
        visitor={selectedBadgeVisitor}
        onClose={() => {
          setIsBadgeModalOpen(false);
          setSelectedBadgeVisitor(null);
        }}
      />

      {/* Modal: Confirm Deletion */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        visitor={selectedDeleteVisitor}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedDeleteVisitor(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal: Staff Auth (Sign In / Sign Up) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(userData) => setUser(userData)}
        onShowToast={showToast}
      />

      {/* Toast Alert System */}
      <Toast 
        toast={toast} 
        onClose={() => setToast(null)} 
      />
    </div>
  );
}
