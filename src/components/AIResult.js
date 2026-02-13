import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function AIResult({ token, user }) {
  const [results, setResults] = useState([]);
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
    };
    return user?.username?.substring(0, 2).toUpperCase() || 'U';
  };

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:8000/api/imaging-results/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch results');
        }
        return response.json();
      })
      .then((data) => {
        const resultList = Array.isArray(data) ? data : (data.results || []);
        setResults(resultList);
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
            <Link to="/hospital" className="nav-item">
              <span className="nav-item-icon">🏨</span>
              Hospital Details
            </Link>
          </div>
        )}
        
        <div className="nav-section">
          <div className="nav-section-title">Medical</div>
          <Link to="/studies" className="nav-item">
            <span className="nav-item-icon">🔬</span>
            Imaging Studies
          </Link>
          <Link to="/results" className="nav-item active">
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

      <div className="main-content">
        <header className="top-header">
          <div className="header-left">
            <h1 className="page-title">AI Analysis Results</h1>
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
                <span className="card-title-icon stat-icon purple">🤖</span>
                AI-Powered Analysis Results
              </h3>
            </div>
            <div className="card-body">
              {loading && <p style={{ color: 'var(--text-muted)' }}>Loading results...</p>}
              {error && <div className="alert alert-error">Error: {typeof error === 'string' ? error : JSON.stringify(error)}</div>}
              {!loading && !error && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>No AI analysis results yet.</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    AI results will appear here once imaging studies have been analyzed.
                  </p>
                </div>
              )}
              {!loading && !error && results.length > 0 && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Study</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>AI Finding</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Confidence</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Status</th>
                      <th style={{ textAlign: 'left', padding: '12px 8px', color: 'var(--text-muted)', fontWeight: 600 }}>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result) => {
                      // Support both flat and nested result_json structure
                      const findings = result.result_json?.findings || [];
                      // If no findings, show a single row as before
                      if (!findings.length) {
                        return (
                          <tr key={result.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{result.study || result.study_id || '-'}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{result.finding || result.ai_finding || '-'}</td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>
                              {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : '-'}
                            </td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.85rem',
                                backgroundColor: result.validated ? 'rgba(29, 201, 183, 0.15)' : 'rgba(255, 194, 65, 0.15)',
                                color: result.validated ? 'var(--success)' : 'var(--warning)',
                              }}>
                                {result.validated ? 'Validated' : 'Pending Review'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                              {result.created_at ? new Date(result.created_at).toLocaleDateString() : '-'}
                            </td>
                          </tr>
                        );
                      }
                      // Otherwise, show a row for each finding
                      return findings.map((finding, idx) => (
                        <tr key={result.id + '-' + idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{result.study || result.study_id || '-'}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>{finding.label || '-'}</td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-primary)' }}>
                            {finding.confidence ? `${(finding.confidence * 100).toFixed(1)}%` : '-'}
                          </td>
                          <td style={{ padding: '12px 8px' }}>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '0.85rem',
                              backgroundColor: result.validated ? 'rgba(29, 201, 183, 0.15)' : 'rgba(255, 194, 65, 0.15)',
                              color: result.validated ? 'var(--success)' : 'var(--warning)',
                            }}>
                              {result.validated ? 'Validated' : 'Pending Review'}
                            </span>
                          </td>
                          <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>
                            {result.created_at ? new Date(result.created_at).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ));
                    })}
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

export default AIResult;
