import React from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function Dashboard({ onLogout }) {
  return (
    <div className="app-layout">
      {/* Sidebar */}
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
            <Link to="/dashboard" className="nav-item active">
              <span className="nav-item-icon">📊</span>
              Dashboard
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <Link to="/user" className="nav-item">
              <span className="nav-item-icon">👥</span>
              Users
            </Link>
            <Link to="/hospital" className="nav-item">
              <span className="nav-item-icon">🏨</span>
              Hospital Details
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Medical</div>
            <Link to="/studies" className="nav-item">
              <span className="nav-item-icon">🔬</span>
              Imaging Studies
            </Link>
            <Link to="/results" className="nav-item">
              <span className="nav-item-icon">📋</span>
              Imaging Results
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">System</div>
            <Link to="/logs" className="nav-item">
              <span className="nav-item-icon">📝</span>
              Access Logs
            </Link>
          </div>
        </nav>
        
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">AD</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">Admin User</div>
              <div className="sidebar-user-role">Administrator</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard</h1>
          </div>
          <div className="header-right">
            <button className="header-btn">
              <span>🔔</span>
              <span className="badge"></span>
            </button>
            <button className="header-btn">
              <span>⚙️</span>
            </button>
            <button onClick={onLogout} className="btn-logout">Logout</button>
          </div>
        </header>

        <div className="page-content">
          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon purple">👥</div>
              <div className="stat-info">
                <div className="stat-value">1,248</div>
                <div className="stat-label">Total Users</div>
                <div className="stat-change up">↑ 12% from last month</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon blue">🔬</div>
              <div className="stat-info">
                <div className="stat-value">3,672</div>
                <div className="stat-label">Imaging Studies</div>
                <div className="stat-change up">↑ 8% from last month</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">🏨</div>
              <div className="stat-info">
                <div className="stat-value">24</div>
                <div className="stat-label">Active Hospitals</div>
                <div className="stat-change up">↑ 2 new this month</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">📋</div>
              <div className="stat-info">
                <div className="stat-value">892</div>
                <div className="stat-label">Pending Results</div>
                <div className="stat-change down">↓ 5% from last week</div>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-title-icon stat-icon purple">👥</span>
                  User Management
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">Manage users, roles, and permissions for your hospital network. Control access levels and monitor user activities.</p>
                <Link to="/user" className="card-btn">
                  Manage Users →
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-title-icon stat-icon blue">🔬</span>
                  Imaging Studies
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">View and manage all imaging studies across your hospital network. Track progress and assign studies to specialists.</p>
                <Link to="/studies" className="card-btn">
                  View Studies →
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-title-icon stat-icon green">📋</span>
                  Imaging Results
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">Access and review imaging results securely. AI-powered analysis helps identify critical findings faster.</p>
                <Link to="/results" className="card-btn">
                  View Results →
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-title-icon stat-icon orange">🏨</span>
                  Hospital Details
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">View and update hospital information, settings, and operational configurations for optimal performance.</p>
                <Link to="/hospital" className="card-btn">
                  Hospital Info →
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-title-icon stat-icon pink">📝</span>
                  Access Logs
                </h3>
              </div>
              <div className="card-body">
                <p className="card-text">Audit and review admin access logs for compliance. Track all system activities and generate reports.</p>
                <Link to="/logs" className="card-btn">
                  View Logs →
                </Link>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <h3 className="card-title">
                  <span className="card-title-icon stat-icon purple">⚡</span>
                  Quick Actions
                </h3>
              </div>
              <div className="card-body">
                <div className="quick-actions">
                  <Link to="/user" className="quick-action">
                    <span className="quick-action-icon">👤</span>
                    <span className="quick-action-text">Manage Users</span>
                  </Link>
                  <Link to="/studies" className="quick-action">
                    <span className="quick-action-icon">📤</span>
                    <span className="quick-action-text">Upload Study</span>
                  </Link>
                  <Link to="/hospital" className="quick-action">
                    <span className="quick-action-icon">🏨</span>
                    <span className="quick-action-text">Hospital Info</span>
                  </Link>
                  <Link to="/logs" className="quick-action">
                    <span className="quick-action-icon">📊</span>
                    <span className="quick-action-text">View Reports</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
