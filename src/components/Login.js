import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      loading: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '' });
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        }),
      });
      const data = await response.json();
      if (response.ok && data.access) {
        if (this.props.onLogin) {
          this.props.onLogin(data.access, data.user || null);
        }
        // Check if user has a hospital - redirect to register-hospital if not
        if (data.user && !data.user.hospital_id) {
          window.location.href = '/register-hospital';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        this.setState({ error: data.detail || 'Invalid credentials', loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Login failed', loading: false });
    }
  };

  render() {
    return (
      <div className="auth-wrapper">
        <div className="auth-sidebar">
          <div className="auth-sidebar-content">
            <div className="auth-brand">
              <div className="auth-brand-icon">🏥</div>
              <span className="auth-brand-text">Healthtect</span>
            </div>
            <h1>Healthcare Management Made Simple</h1>
            <p>
              Streamline your hospital operations with our comprehensive platform for imaging studies, patient management, and compliance tracking.
            </p>
            <ul className="auth-features">
              <li>Medical Imaging Management</li>
              <li>User & Role Administration</li>
              <li>Compliance & Audit Logs</li>
              <li>Multi-Hospital Support</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Welcome Back</h2>
              <p className="auth-card-subtitle">Sign in to your account to continue</p>
            </div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-input"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  required
                  autoComplete="username"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-input"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={this.state.loading}>
                {this.state.loading ? 'Signing in...' : 'Sign In'}
              </button>
              {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
            </form>
            <div className="auth-footer">
              <p><Link to="/forgot-password">Forgot your password?</Link></p>
              <p style={{ marginTop: '8px' }}>Don't have an account? <Link to="/register">Create one</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
