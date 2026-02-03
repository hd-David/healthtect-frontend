import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function Hospital({ token, user }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetch('http://localhost:8000/api/hospitals/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch hospitals');
        }
        return response.json();
      })
      .then((data) => {
        const hospitalList = Array.isArray(data) ? data : (data.results || []);
        setHospitals(hospitalList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

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
            <Link to="/hospital" className="nav-item active">
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
            <h1 className="page-title">Hospital Details</h1>
          </div>
          <div className="header-right">
            <Link to="/dashboard">
              <button className="btn-logout">← Back to Dashboard</button>
            </Link>
          </div>
        </header>

        <div className="page-content">
          {/* Stats */}
          <div className="stats-grid" style={{ marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-icon green">🏨</div>
              <div className="stat-info">
                <div className="stat-value">{hospitals.length}</div>
                <div className="stat-label">Total Hospitals</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">✓</div>
              <div className="stat-info">
                <div className="stat-value">{hospitals.filter(h => h.is_active !== false).length}</div>
                <div className="stat-label">Active Hospitals</div>
              </div>
            </div>
          </div>

          {/* Hospital List */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon green">🏨</span>
                All Hospitals
              </h3>
            </div>
            <div className="card-body">
              {loading && <p style={{ color: 'var(--text-muted)' }}>Loading hospitals...</p>}
              {error && <div className="alert alert-error">Error: {error}</div>}
              {!loading && !error && hospitals.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>No hospitals found. Create your first hospital to get started.</p>
                  <Link to="/create-hospital">
                    <button className="btn-primary" style={{ width: 'auto', padding: '12px 24px' }}>Create Hospital</button>
                  </Link>
                </div>
              )}
              {!loading && !error && hospitals.length > 0 && (
                <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                  {hospitals.map((hospital) => (
                    <div key={hospital.id} className="dashboard-card" style={{ boxShadow: 'var(--shadow)' }}>
                      <div className="card-body">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                          <div className="stat-icon green" style={{ width: '48px', height: '48px', fontSize: '20px', flexShrink: 0 }}>🏨</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontWeight: 600 }}>{hospital.name}</h4>
                            <p style={{ margin: '0 0 8px 0', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{hospital.address || 'No address provided'}</p>
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '4px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600,
                                background: hospital.is_active !== false ? 'rgba(29, 201, 183, 0.15)' : 'rgba(253, 57, 149, 0.15)',
                                color: hospital.is_active !== false ? 'var(--success)' : 'var(--danger)'
                              }}>
                                {hospital.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                              {hospital.contact_phone && (
                                <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', background: 'var(--body-bg)', color: 'var(--text-muted)' }}>
                                  📞 {hospital.contact_phone}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hospital;
