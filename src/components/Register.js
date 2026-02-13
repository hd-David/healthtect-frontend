import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
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
    
    // Validate passwords match
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }

    this.setState({ loading: true, error: '', success: false });
    try {
      const response = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: this.state.firstName,
          last_name: this.state.lastName,
          username: this.state.username,
          email: this.state.email,
          password: this.state.password,
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
        } else if (typeof data?.error === 'string') {
          errorMsg = data.error;
        } else if (typeof data?.detail === 'string') {
          errorMsg = data.detail;
        } else if (data?.error?.message) {
          errorMsg = data.error.message;
        } else if (data?.detail?.message) {
          errorMsg = data.detail.message;
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
            <h1>Join Healthtect</h1>
            <p>
              Create your account to get started. After registration, you'll be able to set up your hospital and start managing your healthcare operations.
            </p>
            <ul className="auth-features">
              <li>Quick & Easy Sign Up</li>
              <li>Register Your Hospital After Login</li>
              <li>HIPAA Compliant Platform</li>
              <li>AI-Powered Imaging Analysis</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Create Account</h2>
              <p className="auth-card-subtitle">Sign up to get started</p>
            </div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    className="form-input"
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    required
                    autoComplete="given-name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    className="form-input"
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
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
                  minLength="8"
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  className="form-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  required
                  minLength="8"
                  autoComplete="new-password"
                />
              </div>

              <button type="submit" className="btn-primary" disabled={this.state.loading}>
                {this.state.loading ? 'Creating Account...' : 'Create Account'}
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
