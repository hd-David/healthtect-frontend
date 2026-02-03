import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function InviteUser({ token, user: currentUser }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'radiologist',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invitations, setInvitations] = useState([]);
  const [loadingInvitations, setLoadingInvitations] = useState(true);

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

  const fetchInvitations = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('http://localhost:8000/api/invitations/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const inviteList = Array.isArray(data) ? data : (data.results || []);
        setInvitations(inviteList);
      }
    } catch (err) {
      console.error('Failed to fetch invitations:', err);
    } finally {
      setLoadingInvitations(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:8000/api/invitations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          email: '',
          firstName: '',
          lastName: '',
          role: 'radiologist',
        });
        fetchInvitations(); // Refresh the list
        setTimeout(() => setSuccess(false), 5000);
      } else {
        // Parse error response - handle various Django REST framework error formats
        let errorMessages = [];
        
        // Handle field-specific errors (e.g., {email: [...], role: [...]})
        const fieldLabels = { email: 'Email', role: 'Role', first_name: 'First Name', last_name: 'Last Name' };
        for (const [field, errors] of Object.entries(data)) {
          if (Array.isArray(errors)) {
            const label = fieldLabels[field] || field;
            errors.forEach(err => {
              const msg = typeof err === 'string' ? err : (err.message || err.string || String(err));
              errorMessages.push(`${label}: ${msg}`);
            });
          } else if (typeof errors === 'string' && !['error', 'detail', 'message'].includes(field)) {
            const label = fieldLabels[field] || field;
            errorMessages.push(`${label}: ${errors}`);
          }
        }
        
        // Handle generic error fields
        if (errorMessages.length === 0) {
          if (typeof data.error === 'string') {
            errorMessages.push(data.error);
          } else if (data.error?.message) {
            errorMessages.push(data.error.message);
          } else if (typeof data.detail === 'string') {
            errorMessages.push(data.detail);
          } else if (data.detail?.message) {
            errorMessages.push(data.detail.message);
          } else if (data.message) {
            errorMessages.push(data.message);
          }
        }
        
        setError(errorMessages.length > 0 ? errorMessages.join(' | ') : 'Failed to send invitation');
      }
    } catch (err) {
      setError('Failed to send invitation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (invitationId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/invitations/${invitationId}/resend/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setError('');
        fetchInvitations();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || data.detail || 'Failed to resend invitation');
      }
    } catch (err) {
      console.error('Failed to resend invitation:', err);
      setError('Failed to resend invitation. Please try again.');
    }
  };

  const handleRevoke = async (invitationId) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/invitations/${invitationId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchInvitations();
      }
    } catch (err) {
      console.error('Failed to revoke invitation:', err);
    }
  };

  const formatDate = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const getStatusBadge = (invitation) => {
    if (invitation.accepted) {
      return <span style={{ color: 'var(--success)', fontWeight: 500 }}>✓ Accepted</span>;
    }
    if (invitation.is_expired) {
      return <span style={{ color: 'var(--danger)', fontWeight: 500 }}>Expired</span>;
    }
    return <span style={{ color: 'var(--warning)', fontWeight: 500 }}>Pending</span>;
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
            <Link to="/invite" className="nav-item active">
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

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">Invite Users</h1>
          </div>
          <div className="header-right">
            <Link to="/dashboard">
              <button className="btn-logout">← Back to Dashboard</button>
            </Link>
          </div>
        </header>

        <div className="page-content">
          {/* Invite Form */}
          <div className="dashboard-card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon purple">✉️</span>
                Send Invitation
              </h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      className="form-input"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      className="form-input"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginTop: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      id="email"
                      name="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" htmlFor="role">Role</label>
                    <select
                      className="form-input"
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="radiologist">Radiologist</option>
                      <option value="clinician">Clinician</option>
                      <option value="hospital_admin">Hospital Admin</option>
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: '24px' }}>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={loading}
                    style={{ width: 'auto', padding: '12px 32px' }}
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </div>
                {success && (
                  <div className="alert alert-success" style={{ marginTop: '16px' }}>
                    Invitation sent successfully! The user will receive an email with instructions to set up their account.
                  </div>
                )}
                {error && (
                  <div className="alert alert-error" style={{ marginTop: '16px' }}>
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Invitations List */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon purple">📋</span>
                Pending & Recent Invitations
              </h3>
            </div>
            <div className="card-body">
              {loadingInvitations && <p style={{ color: 'var(--text-muted)' }}>Loading invitations...</p>}
              {!loadingInvitations && invitations.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>No invitations sent yet.</p>
              )}
              {!loadingInvitations && invitations.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Sent</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Expires</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invitations.map((invitation) => (
                      <tr key={invitation.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>
                          {invitation.first_name} {invitation.last_name}
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{invitation.email}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{invitation.role}</td>
                        <td style={{ padding: '12px 8px' }}>{getStatusBadge(invitation)}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{formatDate(invitation.created_at)}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{formatDate(invitation.expires_at)}</td>
                        <td style={{ padding: '12px 8px' }}>
                          {!invitation.accepted && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleResend(invitation.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--info)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                }}
                              >
                                Resend
                              </button>
                              <button
                                onClick={() => handleRevoke(invitation.id)}
                                style={{
                                  padding: '6px 12px',
                                  background: 'var(--danger)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '0.8rem',
                                }}
                              >
                                Revoke
                              </button>
                            </div>
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

export default InviteUser;
