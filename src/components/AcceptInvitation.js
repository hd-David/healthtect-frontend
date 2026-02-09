import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class AcceptInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
      success: false,
      tokenValid: true,
      validating: true,
      invitationData: null,
    };
  }

  componentDidMount() {
    this.validateInvitation();
  }

  getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }

  validateInvitation = async () => {
    const token = this.getTokenFromUrl();

    if (!token) {
      this.setState({ tokenValid: false, validating: false });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/invitations/validate/?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ 
          tokenValid: true, 
          validating: false,
          invitationData: data,
        });
      } else {
        this.setState({ tokenValid: false, validating: false });
      }
    } catch (err) {
      this.setState({ tokenValid: false, validating: false });
    }
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }

    if (this.state.password.length < 8) {
      this.setState({ error: 'Password must be at least 8 characters long' });
      return;
    }

    if (this.state.username.length < 3) {
      this.setState({ error: 'Username must be at least 3 characters long' });
      return;
    }

    this.setState({ loading: true, error: '', success: false });

    const token = this.getTokenFromUrl();

    try {
      const response = await fetch('http://localhost:8000/api/invitations/accept/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          username: this.state.username,
          password: this.state.password,
          password_confirm: this.state.confirmPassword,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        this.setState({ success: true, loading: false });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        let errorMsg = data.error || data.detail || 'Failed to create account. Please try again.';
        if (data.username) {
          errorMsg = Array.isArray(data.username) ? data.username[0] : data.username;
        }
        this.setState({ error: errorMsg, loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Failed to create account. Please try again.', loading: false });
    }
  };

  render() {
    const { validating, tokenValid, success, invitationData } = this.state;

    return (
      <div className="auth-wrapper">
        <div className="auth-sidebar">
          <div className="auth-sidebar-content">
            <div className="auth-brand">
              <div className="auth-brand-icon">🏥</div>
              <span className="auth-brand-text">Healthtect</span>
            </div>
            <h1>Welcome to Healthtect</h1>
            <p>
              You've been invited to join your hospital's healthcare management platform. 
              Create your account to get started with managing medical imaging and patient care.
            </p>
            <ul className="auth-features">
              <li>Secure Account Creation</li>
              <li>Medical Imaging Access</li>
              <li>Collaboration Tools</li>
              <li>HIPAA Compliant Platform</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            {validating ? (
              <div className="auth-card-header">
                <h2 className="auth-card-title">Validating Invitation...</h2>
                <p className="auth-card-subtitle">Please wait while we verify your invitation</p>
              </div>
            ) : !tokenValid ? (
              <div>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Invalid or Expired Invitation</h2>
                  <p className="auth-card-subtitle">This invitation link is no longer valid</p>
                </div>
                <div className="alert alert-error">
                  This invitation has expired or has already been used. 
                  Please contact your administrator for a new invitation.
                </div>
                <div className="auth-footer" style={{ marginTop: '24px' }}>
                  <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
              </div>
            ) : success ? (
              <div>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Account Created!</h2>
                  <p className="auth-card-subtitle">Your account has been set up successfully</p>
                </div>
                <div className="alert alert-success">
                  <strong>Welcome aboard!</strong><br />
                  Your account has been created. Redirecting you to login...
                </div>
              </div>
            ) : (
              <div>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Complete Your Registration</h2>
                  <p className="auth-card-subtitle">Set up your account to join your team</p>
                </div>
                {invitationData && (
                  <div style={{ 
                    background: 'var(--body-bg)', 
                    padding: '16px', 
                    borderRadius: 'var(--radius)',
                    marginBottom: '24px'
                  }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <strong>Invited as:</strong> {invitationData.first_name} {invitationData.last_name}
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <strong>Email:</strong> {invitationData.email}
                    </p>
                    <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <strong>Role:</strong> {invitationData.role}
                    </p>
                    {invitationData.hospital_name && (
                      <p style={{ margin: '8px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        <strong>Hospital:</strong> {invitationData.hospital_name}
                      </p>
                    )}
                  </div>
                )}
                <form onSubmit={this.handleSubmit} autoComplete="off">
                  <div className="form-group">
                    <label className="form-label" htmlFor="username">Choose Username</label>
                    <input
                      type="text"
                      className="form-input"
                      id="username"
                      name="username"
                      placeholder="Choose a username"
                      value={this.state.username}
                      onChange={this.handleChange}
                      required
                      minLength={3}
                      autoComplete="username"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">Create Password</label>
                    <input
                      type="password"
                      className="form-input"
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      required
                      minLength={8}
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
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={this.state.loading}>
                    {this.state.loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                  {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
                </form>
                <div className="auth-footer">
                  <p>Already have an account? <Link to="/login">Sign in</Link></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AcceptInvitation;
