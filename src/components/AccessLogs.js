import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function AccessLogs({ token, user }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const getLogUserLabel = (log) => {
    if (!log) return '-';
    const value = log.username || log.user_email || log.user;
    if (value === null || value === undefined) return '-';
    return String(value);
  };

  const getLogUserInitials = (log) => {
    const label = getLogUserLabel(log).trim();
    if (!label || label === '-') return 'U';
    return label.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/admin/access-logs/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch access logs');
        }
        return response.json();
      })
      .then((data) => {
        const logList = Array.isArray(data) ? data : (data.results || []);
        setLogs(logList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const getActionColor = (action) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('login') || actionLower.includes('success')) {
      return { bg: 'rgba(29, 201, 183, 0.15)', color: 'var(--success)' };
    }
    if (actionLower.includes('logout')) {
      return { bg: 'rgba(33, 150, 243, 0.15)', color: 'var(--info)' };
    }
    if (actionLower.includes('failed') || actionLower.includes('error') || actionLower.includes('denied')) {
      return { bg: 'rgba(253, 57, 149, 0.15)', color: 'var(--danger)' };
    }
    if (actionLower.includes('create') || actionLower.includes('add')) {
      return { bg: 'rgba(29, 201, 183, 0.15)', color: 'var(--success)' };
    }
    if (actionLower.includes('update') || actionLower.includes('edit') || actionLower.includes('modify')) {
      return { bg: 'rgba(255, 194, 65, 0.15)', color: 'var(--warning)' };
    }
    if (actionLower.includes('delete') || actionLower.includes('remove')) {
      return { bg: 'rgba(253, 57, 149, 0.15)', color: 'var(--danger)' };
    }
    if (actionLower.includes('view') || actionLower.includes('read') || actionLower.includes('access')) {
      return { bg: 'rgba(33, 150, 243, 0.15)', color: 'var(--info)' };
    }
    return { bg: 'var(--body-bg)', color: 'var(--text-muted)' };
  };

  const getActionIcon = (action) => {
    const actionLower = action?.toLowerCase() || '';
    if (actionLower.includes('login')) return '🔓';
    if (actionLower.includes('logout')) return '🔒';
    if (actionLower.includes('failed') || actionLower.includes('error') || actionLower.includes('denied')) return '⚠️';
    if (actionLower.includes('create') || actionLower.includes('add')) return '➕';
    if (actionLower.includes('update') || actionLower.includes('edit')) return '✏️';
    if (actionLower.includes('delete') || actionLower.includes('remove')) return '🗑️';
    if (actionLower.includes('view') || actionLower.includes('read')) return '👁️';
    if (actionLower.includes('export') || actionLower.includes('download')) return '📥';
    if (actionLower.includes('upload') || actionLower.includes('import')) return '📤';
    return '📝';
  };

  // Filter and search logs
  const filteredLogs = logs.filter((log) => {
    const matchesFilter = filter === 'all' || 
      (log.action?.toLowerCase().includes(filter) || log.action_type?.toLowerCase() === filter);
    
    const searchValue = searchTerm.toLowerCase();
    const userSearch = getLogUserLabel(log).toLowerCase();
    const matchesSearch = searchTerm === '' || 
      userSearch.includes(searchValue) ||
      log.action?.toLowerCase().includes(searchValue) ||
      log.ip_address?.includes(searchTerm) ||
      log.resource?.toLowerCase().includes(searchValue);
    
    return matchesFilter && matchesSearch;
  });

  // Stats
  const stats = {
    total: logs.length,
    logins: logs.filter(l => l.action?.toLowerCase().includes('login')).length,
    failures: logs.filter(l => 
      l.action?.toLowerCase().includes('failed') || 
      l.action?.toLowerCase().includes('denied') ||
      l.action?.toLowerCase().includes('error')
    ).length,
    today: logs.filter(l => {
      const logDate = new Date(l.timestamp || l.created_at);
      const today = new Date();
      return logDate.toDateString() === today.toDateString();
    }).length,
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
        
        {(isRadiologist || isClinician || isAdmin) && (
          <div className="nav-section">
            <div className="nav-section-title">Medical</div>
            <Link to="/studies" className="nav-item">
              <span className="nav-item-icon">🔬</span>
              Imaging Studies
            </Link>
            <Link to="/results" className="nav-item">
              <span className="nav-item-icon">🤖</span>
              AI Analysis Results
            </Link>
          </div>
        )}
        
        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-title">System</div>
            <Link to="/logs" className="nav-item active">
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
            <h1 className="page-title">Access Logs</h1>
          </div>
          <div className="header-right">
            <Link to="/dashboard">
              <button className="btn-logout">← Back to Dashboard</button>
            </Link>
          </div>
        </header>

        <div className="page-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">📝</div>
              <div className="stat-info">
                <div className="stat-value">{stats.total}</div>
                <div className="stat-label">Total Logs</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🔓</div>
              <div className="stat-info">
                <div className="stat-value">{stats.logins}</div>
                <div className="stat-label">Login Events</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">⚠️</div>
              <div className="stat-info">
                <div className="stat-value">{stats.failures}</div>
                <div className="stat-label">Failed Attempts</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">📅</div>
              <div className="stat-info">
                <div className="stat-value">{stats.today}</div>
                <div className="stat-label">Today's Activity</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            <div className="card-body" style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Filter by Action:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Actions</option>
                  <option value="login">Logins</option>
                  <option value="logout">Logouts</option>
                  <option value="view">Views</option>
                  <option value="create">Creates</option>
                  <option value="update">Updates</option>
                  <option value="delete">Deletes</option>
                  <option value="failed">Failed Attempts</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '200px' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Search:</label>
                <input
                  type="text"
                  placeholder="Search by user, action, IP..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--card-bg)',
                    color: 'var(--text-primary)',
                    flex: 1,
                    maxWidth: '300px',
                  }}
                />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Showing {filteredLogs.length} of {logs.length} logs
              </div>
            </div>
          </div>

          {/* Logs Table */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon purple">📝</span>
                System Access Logs
              </h3>
            </div>
            <div className="card-body">
              {loading && <p style={{ color: 'var(--text-muted)' }}>Loading access logs...</p>}
              {error && <div className="alert alert-error">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>}
              {!loading && !error && logs.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>No access logs found.</p>
              )}
              {!loading && !error && logs.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Timestamp</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>User</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Action</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Resource</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>IP Address</th>
                        <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogs.map((log, index) => {
                        const actionStyle = getActionColor(log.action || log.action_type);
                        return (
                          <tr key={log.id || index} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                              {formatDate(log.timestamp || log.created_at)}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ 
                                  width: '32px', 
                                  height: '32px', 
                                  borderRadius: '50%', 
                                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                }}>
                                  {getLogUserInitials(log)}
                                </div>
                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                                  {getLogUserLabel(log)}
                                </span>
                              </div>
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{
                                padding: '4px 12px',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                backgroundColor: actionStyle.bg,
                                color: actionStyle.color,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}>
                                <span>{getActionIcon(log.action || log.action_type)}</span>
                                {log.action || log.action_type || '-'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>
                              {log.resource || log.endpoint || log.path || '-'}
                            </td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                              {log.ip_address || log.ip || '-'}
                            </td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {log.details || log.description || log.user_agent || '-'}
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

export default AccessLogs;
