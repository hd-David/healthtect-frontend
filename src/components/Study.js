import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function Study({ token, user }) {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const isAdmin = user?.is_hospital_admin;
  const isRadiologist = user?.is_radiologist;
  const isClinician = user?.is_clinician;

  const getUserRole = () => {
    if (isAdmin) return 'Hospital Admin';
    if (isRadiologist) return 'Radiologist';
    if (isClinician) return 'Clinician';
    return 'User';
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/studies/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch studies');
        }
        return response.json();
      })
      .then((data) => {
        const studyList = Array.isArray(data) ? data : (data.results || []);
        setStudies(studyList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { bg: 'rgba(29, 201, 183, 0.15)', color: 'var(--success)' };
      case 'pending': return { bg: 'rgba(255, 194, 65, 0.15)', color: 'var(--warning)' };
      case 'in_progress': case 'in progress': return { bg: 'rgba(33, 150, 243, 0.15)', color: 'var(--info)' };
      case 'cancelled': case 'failed': return { bg: 'rgba(253, 57, 149, 0.15)', color: 'var(--danger)' };
      default: return { bg: 'var(--body-bg)', color: 'var(--text-muted)' };
    }
  };

  const getModalityIcon = (modality) => {
    switch (modality?.toUpperCase()) {
      case 'CT': return '🔬';
      case 'MRI': case 'MR': return '🧲';
      case 'XR': case 'X-RAY': case 'CR': return '☢️';
      case 'US': case 'ULTRASOUND': return '📡';
      case 'PET': return '⚛️';
      default: return '🏥';
    }
  };

  const filteredStudies = filter === 'all' 
    ? studies 
    : studies.filter(s => s.status?.toLowerCase() === filter);

  const stats = {
    total: studies.length,
    pending: studies.filter(s => s.status?.toLowerCase() === 'pending').length,
    inProgress: studies.filter(s => ['in_progress', 'in progress'].includes(s.status?.toLowerCase())).length,
    completed: studies.filter(s => s.status?.toLowerCase() === 'completed').length,
  };

  const renderSidebar = () => (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/dashboard" className="sidebar-brand">
          <div className="sidebar-brand-icon">🏥</div>
          <span className="sidebar-brand-text">Healthtect</span>
        </Link>
      </div>
      
      <nav className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-section-title">Main Menu</div>
          <Link to="/dashboard" className="nav-item">
            <span className="nav-item-icon">📊</span>
            Dashboard
          </Link>
        </div>
        
        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <Link to="/user" className="nav-item">
              <span className="nav-item-icon">👥</span>
              Users
            </Link>
            <Link to="/invite" className="nav-item">
              <span className="nav-item-icon">✉️</span>
              Invite Users
            </Link>
            <Link to="/hospital" className="nav-item">
              <span className="nav-item-icon">🏨</span>
              Hospital Details
            </Link>
          </div>
        )}
        
        <div className="nav-section">
          <div className="nav-section-title">Medical</div>
          <Link to="/studies" className="nav-item active">
            <span className="nav-item-icon">🔬</span>
            Imaging Studies
          </Link>
          <Link to="/results" className="nav-item">
            <span className="nav-item-icon">🤖</span>
            AI Analysis Results
          </Link>
        </div>
        
        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-title">System</div>
            <Link to="/logs" className="nav-item">
              <span className="nav-item-icon">📝</span>
              Access Logs
            </Link>
          </div>
        )}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{getUserInitials()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user?.username}
            </div>
            <div className="sidebar-user-role">{getUserRole()}</div>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="app-layout">
      {renderSidebar()}

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">Imaging Studies</h1>
          </div>
          <div className="header-right">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ 
                padding: '8px 16px', 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border-color)',
                background: 'var(--card-bg)',
                marginRight: '12px',
                fontSize: '0.875rem'
              }}
            >
              <option value="all">All Studies</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <Link to="/dashboard">
              <button className="btn-logout">← Back to Dashboard</button>
            </Link>
          </div>
        </header>

        <div className="page-content">
          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">🔬</div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Studies</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">⏳</div>
              <div className="stat-info">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🔄</div>
              <div className="stat-info">
                <div className="stat-value">{stats.inProgress}</div>
                <div className="stat-label">In Progress</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">✓</div>
              <div className="stat-info">
                <div className="stat-value">{stats.completed}</div>
                <div className="stat-label">Completed</div>
              </div>
            </div>
          </div>

          {/* Studies Table */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon blue">🔬</span>
                Study List
              </h3>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                {filteredStudies.length} {filter === 'all' ? 'total' : filter} studies
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {loading && <p style={{ color: 'var(--text-muted)', padding: '24px' }}>Loading studies...</p>}
              {error && <div className="alert alert-error" style={{ margin: '24px' }}>Error: {error}</div>}
              {!loading && !error && filteredStudies.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔬</div>
                  <p style={{ color: 'var(--text-muted)' }}>No studies found.</p>
                </div>
              )}
              {!loading && !error && filteredStudies.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ background: 'var(--body-bg)' }}>
                        <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Study ID</th>
                        <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Patient</th>
                        <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Modality</th>
                        <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</th>
                        <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</th>
                        <th style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudies.map((study) => {
                        const statusStyle = getStatusColor(study.status);
                        return (
                          <tr key={study.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '16px', color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                              #{study.id || study.study_instance_uid?.slice(-8) || '-'}
                            </td>
                            <td style={{ padding: '16px' }}>
                              <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{study.patient_name || study.patient_id || 'Unknown'}</div>
                              {study.patient_id && study.patient_name && (
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {study.patient_id}</div>
                              )}
                            </td>
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '18px' }}>{getModalityIcon(study.modality)}</span>
                                <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{study.modality || '-'}</span>
                              </div>
                            </td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {study.study_description || study.description || '-'}
                            </td>
                            <td style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                              {study.study_date ? new Date(study.study_date).toLocaleDateString() : (study.created_at ? new Date(study.created_at).toLocaleDateString() : '-')}
                            </td>
                            <td style={{ padding: '16px' }}>
                              <span style={{ 
                                padding: '6px 12px', 
                                borderRadius: '4px', 
                                fontSize: '0.8rem', 
                                fontWeight: 600,
                                background: statusStyle.bg,
                                color: statusStyle.color,
                                textTransform: 'capitalize'
                              }}>
                                {study.status || 'Unknown'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Study;
