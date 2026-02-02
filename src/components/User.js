import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function User({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/users/', {
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
        setUsers(userList);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

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
            <Link to="/dashboard" className="nav-item">
              <span className="nav-item-icon">📊</span>
              Dashboard
            </Link>
          </div>
          
          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <Link to="/user" className="nav-item active">
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
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">User Management</h1>
          </div>
          <div className="header-right">
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
              {loading && <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>}
              {error && <div className="alert alert-error">Error: {error}</div>}
              {!loading && !error && users.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
              )}
              {!loading && !error && users.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>ID</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Username</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{user.id}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-primary)', fontWeight: 500 }}>{user.username || '-'}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{user.email || '-'}</td>
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
