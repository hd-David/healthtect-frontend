import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function User({ token, user: currentUser }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState(null);
  const [syncError, setSyncError] = useState(null);
  const [hospitalId, setHospitalId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = currentUser?.is_hospital_admin;
  const isRadiologist = currentUser?.is_radiologist;
  const isClinician = currentUser?.is_clinician;

  const getUserRole = () => {
    if (isAdmin) return 'Hospital Admin';
    if (isRadiologist) return 'Radiologist';
    if (isClinician) return 'Clinician';
    return 'User';
  };

  const getUserInitials = () => {
    if (currentUser?.first_name && currentUser?.last_name) {
      return `${currentUser.first_name[0]}${currentUser.last_name[0]}`.toUpperCase();
    }
    return currentUser?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/admin/users/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Handle both paginated response {results: [...]} and plain array
        const userList = Array.isArray(data) ? data : (data.results || []);
        console.log("Fetched users:", userList);
        setUsers(userList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  const handleSyncOrthanc = () => {
    if (!token) return;
    setSyncing(true);
    setSyncMessage(null);
    setSyncError(null);

    const payload = hospitalId ? { hospital_id: hospitalId } : {};

    fetch('http://localhost:8000/api/orthanc/sync/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          const message =
            typeof data?.error === 'string' ? data.error
            : data?.error?.message || data?.detail || data?.detail?.message || data?.message || 'Failed to sync Orthanc.';
          throw new Error(message);
        }
        return data;
      })
      .then((data) => {
        setSyncMessage(
          `Orthanc sync completed. New studies: ${data.new_studies_created ?? 0}`
        );
      })
      .catch((err) => {
        setSyncError(err.message);
      })
      .finally(() => {
        setSyncing(false);
      });
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const handleDeleteUser = async (user) => {
    if (!token) return;
    setDeleting(true);
    setActionMessage(null);
    
    try {
      const response = await fetch(`http://localhost:8000/api/hospital/members/${user.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== user.id));
        setActionMessage({ type: 'success', text: data.message || 'User deleted successfully.' });
      } else {
        const errText =
          typeof data?.error === 'string' ? data.error
          : data?.error?.message || data?.detail || data?.detail?.message || data?.message || 'Failed to delete user.';
        setActionMessage({ type: 'error', text: errText });
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: 'Failed to delete user. Please try again.' });
    } finally {
      setDeleting(false);
      setDeleteConfirm(null);
    }
  };

  const renderSidebar = () => (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
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
            <Link to="/user" className="nav-item active">
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
              {currentUser?.first_name ? `${currentUser.first_name} ${currentUser.last_name || ''}`.trim() : currentUser?.username}
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
      <div
        className={`sidebar-backdrop ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
            <h1 className="page-title">User Management</h1>
          </div>
          <div className="header-right">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '12px' }}>
              <input
                type="text"
                placeholder="Hospital ID (platform only)"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  width: '220px',
                }}
              />
              <button className="btn-primary" onClick={handleSyncOrthanc} disabled={syncing}>
                {syncing ? 'Syncing...' : 'Sync Orthanc'}
              </button>
            </div>
            <Link to="/dashboard">
              <button className="btn-logout">← Back to Dashboard</button>
            </Link>
          </div>
        </header>

        <div className="page-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon purple">👥</span>
                All Users
              </h3>
            </div>
            <div className="card-body">
              {syncMessage && <div className="alert alert-success">{syncMessage}</div>}
              {syncError && (
                <div className="alert alert-error">
                  Error: {typeof syncError === 'string' ? syncError : (syncError && syncError.message ? syncError.message : JSON.stringify(syncError))}
                </div>
              )}
              {actionMessage && (
                <div className={`alert ${actionMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                  {typeof actionMessage.text === 'string' ? actionMessage.text : (actionMessage.text && actionMessage.text.message ? actionMessage.text.message : JSON.stringify(actionMessage.text))}
                </div>
              )}
              {loading && <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>}
              {error && <div className="alert alert-error">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>}
              {!loading && !error && users.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
              )}
              {!loading && !error && users.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Username</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Last Login</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Activities</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Joined</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{user.id}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '-'}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>{user.username || '-'}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{user.email || '-'}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{user.role || '-'}</td>
                        <td style={{ padding: '12px 8px', color: user.is_active ? 'var(--success)' : 'var(--danger)' }}>
                          {user.is_active ? 'Active' : 'Inactive'}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                          {user.last_login_display || formatDate(user.last_login)}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>
                          {typeof user.activity_count === 'number' ? user.activity_count : '-'}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                          {formatDate(user.date_joined)}
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          {deleteConfirm === user.id ? (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <span style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>Delete?</span>
                              <button
                                onClick={() => handleDeleteUser(user)}
                                disabled={deleting}
                                style={{
                                  padding: '4px 12px',
                                  backgroundColor: 'var(--danger)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: deleting ? 'not-allowed' : 'pointer',
                                  fontSize: '0.85rem',
                                }}
                              >
                                {deleting ? '...' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                style={{
                                  padding: '4px 12px',
                                  backgroundColor: 'var(--border-color)',
                                  color: 'var(--text-primary)',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.85rem',
                                }}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(user.id)}
                              style={{
                                padding: '6px 12px',
                                backgroundColor: 'transparent',
                                color: 'var(--danger)',
                                border: '1px solid var(--danger)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                              }}
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default User;
