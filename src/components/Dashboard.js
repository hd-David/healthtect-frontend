import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function Dashboard({ onLogout, user, token }) {
  const [stats, setStats] = useState(null);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const closeSidebar = () => setSidebarOpen(false);
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  useEffect(() => {
    if (!token) return;

    // Fetch stats for admins
    if (isAdmin) {
      fetch('http://localhost:8000/api/admin/dashboard/', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Failed to fetch stats:', err));
    }

    // Fetch studies for radiologists
    if (isRadiologist) {
      fetch('http://localhost:8000/api/imaging-studies/', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          const studyList = Array.isArray(data) ? data : (data.results || []);
          setStudies(studyList);
        })
        .catch(err => console.error('Failed to fetch studies:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, isAdmin, isRadiologist]);

  // Sidebar navigation based on role
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
          <Link to="/dashboard" className="nav-item active" onClick={closeSidebar}>
            <span className="nav-item-icon">📊</span>
            Dashboard
          </Link>
        </div>
        
        {/* Admin-only Management Section */}
        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <Link to="/user" className="nav-item" onClick={closeSidebar}>
              <span className="nav-item-icon">👥</span>
              Users
            </Link>
            <Link to="/invite" className="nav-item" onClick={closeSidebar}>
              <span className="nav-item-icon">✉️</span>
              Invite Users
            </Link>
            <Link to="/hospital" className="nav-item" onClick={closeSidebar}>
              <span className="nav-item-icon">🏨</span>
              Hospital Details
            </Link>
          </div>
        )}
        
        {/* Medical Section - for Radiologists and Clinicians */}
        {(isRadiologist || isClinician || isAdmin) && (
          <div className="nav-section">
            <div className="nav-section-title">Medical</div>
            <Link to="/studies" className="nav-item" onClick={closeSidebar}>
              <span className="nav-item-icon">🔬</span>
              Imaging Studies
            </Link>
            <Link to="/results" className="nav-item" onClick={closeSidebar}>
              <span className="nav-item-icon">🤖</span>
              AI Analysis Results
            </Link>
          </div>
        )}
        
        {/* Admin-only System Section */}
        {isAdmin && (
          <div className="nav-section">
            <div className="nav-section-title">System</div>
            <Link to="/logs" className="nav-item" onClick={closeSidebar}>
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

  // Admin Dashboard Content
  const renderAdminDashboard = () => (
    <div className="page-content">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">👥</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.total_users || 0}</div>
            <div className="stat-label">Total Users</div>
            <div className="stat-change">{stats?.active_users || 0} active</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">👨‍⚕️</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.radiologists_count || 0}</div>
            <div className="stat-label">Radiologists</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🩺</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.clinicians_count || 0}</div>
            <div className="stat-label">Clinicians</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">📋</div>
          <div className="stat-info">
            <div className="stat-value">{stats?.total_activities_today || 0}</div>
            <div className="stat-label">Activities Today</div>
          </div>
        </div>
      </div>

      {/* Admin Cards */}
      <div className="cards-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-icon stat-icon purple">👥</span>
              User Management
            </h3>
          </div>
          <div className="card-body">
            <p className="card-text">Manage users, roles, and permissions for your hospital.</p>
            <Link to="/user" className="card-btn">Manage Users →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-icon stat-icon blue">✉️</span>
              Invite Team Members
            </h3>
          </div>
          <div className="card-body">
            <p className="card-text">Send invitations to radiologists and clinicians to join your hospital.</p>
            <Link to="/invite" className="card-btn">Invite Users →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-icon stat-icon green">🏨</span>
              Hospital Settings
            </h3>
          </div>
          <div className="card-body">
            <p className="card-text">View and update hospital information and settings.</p>
            <Link to="/hospital" className="card-btn">Hospital Info →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-icon stat-icon orange">📝</span>
              Access Logs
            </h3>
          </div>
          <div className="card-body">
            <p className="card-text">Audit and review access logs for compliance tracking.</p>
            <Link to="/logs" className="card-btn">View Logs →</Link>
          </div>
        </div>
      </div>
    </div>
  );

  // Radiologist Dashboard Content
  const renderRadiologistDashboard = () => {
    const pendingStudies = studies.filter(s => s.status?.toLowerCase() === 'pending');
    const completedStudies = studies.filter(s => s.status?.toLowerCase() === 'completed');

    return (
      <div className="page-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">🔬</div>
            <div className="stat-info">
              <div className="stat-value">{studies.length}</div>
              <div className="stat-label">Total Studies</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">⏳</div>
            <div className="stat-info">
              <div className="stat-value">{pendingStudies.length}</div>
              <div className="stat-label">Pending Review</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✅</div>
            <div className="stat-info">
              <div className="stat-value">{completedStudies.length}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">🤖</div>
            <div className="stat-info">
              <div className="stat-value">AI</div>
              <div className="stat-label">Analysis Ready</div>
            </div>
          </div>
        </div>

        {/* Main Cards */}
        <div className="cards-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon blue">🔬</span>
                Imaging Studies
              </h3>
            </div>
            <div className="card-body">
              <p className="card-text">View and analyze imaging studies assigned to you. Review patient scans and provide diagnoses.</p>
              <Link to="/studies" className="card-btn">View Studies →</Link>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon purple">🤖</span>
                AI Analysis Results
              </h3>
            </div>
            <div className="card-body">
              <p className="card-text">Review AI-powered analysis results for imaging studies. Validate findings and add clinical notes.</p>
              <Link to="/results" className="card-btn">View AI Results →</Link>
            </div>
          </div>
        </div>

        {/* Recent Studies Table */}
        {pendingStudies.length > 0 && (
          <div className="dashboard-card" style={{ marginTop: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">
                <span className="card-title-icon stat-icon orange">⏳</span>
                Studies Pending Review
              </h3>
            </div>
            <div className="card-body">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Patient</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Modality</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Description</th>
                    <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingStudies.slice(0, 5).map((study) => (
                    <tr key={study.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{study.patient_name || study.patient_id || '-'}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{study.modality || '-'}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{study.description || study.study_description || '-'}</td>
                      <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{study.study_date || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link to="/studies" className="card-btn" style={{ marginTop: '16px', display: 'inline-block' }}>
                View All Studies →
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Clinician Dashboard Content
  const renderClinicianDashboard = () => (
    <div className="page-content">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div className="stat-info">
            <div className="stat-value">View</div>
            <div className="stat-label">Patient Results</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🤖</div>
          <div className="stat-info">
            <div className="stat-value">AI</div>
            <div className="stat-label">Analysis Available</div>
          </div>
        </div>
      </div>

      <div className="cards-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-icon stat-icon blue">📋</span>
              Imaging Results
            </h3>
          </div>
          <div className="card-body">
            <p className="card-text">Access imaging results for your patients. Review radiologist reports and AI analysis findings.</p>
            <Link to="/results" className="card-btn">View Results →</Link>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              <span className="card-title-icon stat-icon green">🔬</span>
              View Studies
            </h3>
          </div>
          <div className="card-body">
            <p className="card-text">Browse imaging studies for your patients to track their diagnostic journey.</p>
            <Link to="/studies" className="card-btn">View Studies →</Link>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-layout">
      {renderSidebar()}
      {sidebarOpen && <div className="sidebar-backdrop open" onClick={closeSidebar} />}

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <button
              type="button"
              className="menu-toggle"
              aria-label="Toggle menu"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <h1 className="page-title">
              {isAdmin ? 'Admin Dashboard' : isRadiologist ? 'Radiologist Dashboard' : 'Dashboard'}
            </h1>
            {user?.hospital_name && (
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginLeft: '12px' }}>
                {user.hospital_name}
              </span>
            )}
          </div>
          <div className="header-right">
            <span style={{ color: 'var(--text-muted)', marginRight: '16px' }}>
              Welcome, {user?.first_name || user?.username}
            </span>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </header>

        {loading ? (
          <div className="page-content">
            <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          </div>
        ) : isAdmin ? (
          renderAdminDashboard()
        ) : isRadiologist ? (
          renderRadiologistDashboard()
        ) : isClinician ? (
          renderClinicianDashboard()
        ) : (
          <div className="page-content">
            <div className="dashboard-card">
              <div className="card-body">
                <p>Welcome to Healthtect. Please contact your administrator for role assignment.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
