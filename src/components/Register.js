import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // User details
      username: '',
      email: '',
      password: '',
      // Hospital details
      hospitalName: '',
      hospitalAddress: '',
      hospitalPhone: '',
      hospitalEmail: '',
      // UI state
      error: '',
      loading: false,
      success: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, error: '', success: false });
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
          hospital: {
            name: this.state.hospitalName,
            address: this.state.hospitalAddress,
            contact_phone: this.state.hospitalPhone,
            contact_email: this.state.hospitalEmail,
          }
        }),
      });
      if (response.ok) {
        this.setState({ success: true, loading: false });
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        if (this.props.onRegister) this.props.onRegister();
      } else {
        const data = await response.json();
        let errorMsg = 'Registration failed';
        if (data && data.username && Array.isArray(data.username)) {
          if (data.username.some(msg => msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('exist'))) {
            errorMsg = 'A user with this username already exists.';
          } else {
            errorMsg = data.username.join(' ');
          }
        } else if (data && data.email && Array.isArray(data.email)) {
          if (data.email.some(msg => msg.toLowerCase().includes('unique') || msg.toLowerCase().includes('exist'))) {
            errorMsg = 'A user with this email already exists.';
          } else {
            errorMsg = data.email.join(' ');
          }
        } else if (data && data.hospital) {
          errorMsg = typeof data.hospital === 'string' ? data.hospital : 'Invalid hospital details';
        } else if (data && data.error) {
          errorMsg = data.error;
        } else if (data && data.detail) {
          errorMsg = data.detail;
        }
        this.setState({ error: errorMsg, loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Registration failed. Please try again.', loading: false });
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
            <h1>Register Your Hospital</h1>
            <p>
              Create your admin account and register your hospital to access powerful tools for managing medical imaging and patient care.
            </p>
            <ul className="auth-features">
              <li>One Admin Per Hospital</li>
              <li>Full Hospital Management</li>
              <li>HIPAA Compliant Platform</li>
              <li>AI-Powered Imaging Analysis</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card" style={{ maxWidth: '480px' }}>
            <div className="auth-card-header">
              <h2 className="auth-card-title">Create Account & Hospital</h2>
              <p className="auth-card-subtitle">Set up your hospital in one step</p>
            </div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              {/* Admin Account Section */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤</span> Admin Account
                </h4>
                <div className="form-group">
                  <label className="form-label" htmlFor="username">Username</label>
                  <input
                    type="text"
                    className="form-input"
                    id="username"
                    name="username"
                    placeholder="Choose a username"
                    value={this.state.username}
                    onChange={this.handleChange}
                    required
                    autoComplete="username"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="password">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    id="password"
                    name="password"
                    placeholder="Create a password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    required
                    autoComplete="new-password"
                  />
                </div>
              </div>

              {/* Hospital Section */}
              <div style={{ marginBottom: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🏨</span> Hospital Details
                </h4>
                <div className="form-group">
                  <label className="form-label" htmlFor="hospitalName">Hospital Name</label>
                  <input
                    type="text"
                    className="form-input"
                    id="hospitalName"
                    name="hospitalName"
                    placeholder="Enter hospital name"
                    value={this.state.hospitalName}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="hospitalAddress">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    id="hospitalAddress"
                    name="hospitalAddress"
                    placeholder="Enter hospital address"
                    value={this.state.hospitalAddress}
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="hospitalPhone">Phone (Optional)</label>
                    <input
                      type="tel"
                      className="form-input"
                      id="hospitalPhone"
                      name="hospitalPhone"
                      placeholder="Contact phone"
                      value={this.state.hospitalPhone}
                      onChange={this.handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="hospitalEmail">Email (Optional)</label>
                    <input
                      type="email"
                      className="form-input"
                      id="hospitalEmail"
                      name="hospitalEmail"
                      placeholder="Contact email"
                      value={this.state.hospitalEmail}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={this.state.loading}>
                {this.state.loading ? 'Creating Account & Hospital...' : 'Register Hospital'}
              </button>
              {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
              {this.state.success && <div className="alert alert-success">Registration successful! Redirecting to login...</div>}
            </form>
            <div className="auth-footer">
              <p>Already have an account? <Link to="/login">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
