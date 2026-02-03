import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      error: '',
      loading: false,
      success: false,
      tokenValid: true,
      validating: true,
    };
  }

  componentDidMount() {
    // Validate the reset token on component mount
    this.validateToken();
  }

  getTokenFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
  }

  getUidFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('uid');
  }

  validateToken = async () => {
    const token = this.getTokenFromUrl();
    const uid = this.getUidFromUrl();

    if (!token || !uid) {
      this.setState({ tokenValid: false, validating: false });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/password-reset/validate/?token=${token}&uid=${uid}`);
      if (response.ok) {
        this.setState({ tokenValid: true, validating: false });
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

    this.setState({ loading: true, error: '', success: false });

    const token = this.getTokenFromUrl();
    const uid = this.getUidFromUrl();

    try {
      const response = await fetch('http://localhost:8000/api/password-reset/confirm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: token,
          uid: uid,
          password: this.state.password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        this.setState({ success: true, loading: false });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        const errorMsg = data.error || data.detail || 'Failed to reset password. Please try again.';
        this.setState({ error: errorMsg, loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Failed to reset password. Please try again.', loading: false });
    }
  };

  render() {
    const { validating, tokenValid, success } = this.state;

    return (
      <div className="auth-wrapper">
        <div className="auth-sidebar">
          <div className="auth-sidebar-content">
            <div className="auth-brand">
              <div className="auth-brand-icon">🏥</div>
              <span className="auth-brand-text">Healthtect</span>
            </div>
            <h1>Create New Password</h1>
            <p>
              Choose a strong password to protect your account. Make sure it's at least 8 characters and includes a mix of letters, numbers, and symbols.
            </p>
            <ul className="auth-features">
              <li>Minimum 8 Characters</li>
              <li>Mix of Letters & Numbers</li>
              <li>Secure Encryption</li>
              <li>Immediate Access After Reset</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            {validating ? (
              <div className="auth-card-header">
                <h2 className="auth-card-title">Validating...</h2>
                <p className="auth-card-subtitle">Please wait while we verify your reset link</p>
              </div>
            ) : !tokenValid ? (
              <div>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Invalid or Expired Link</h2>
                  <p className="auth-card-subtitle">This password reset link is no longer valid</p>
                </div>
                <div className="alert alert-error">
                  The password reset link has expired or is invalid. Please request a new one.
                </div>
                <div style={{ marginTop: '24px' }}>
                  <Link to="/forgot-password">
                    <button className="btn-primary">Request New Link</button>
                  </Link>
                </div>
                <div className="auth-footer">
                  <p><Link to="/login">← Back to Login</Link></p>
                </div>
              </div>
            ) : success ? (
              <div>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Password Reset!</h2>
                  <p className="auth-card-subtitle">Your password has been successfully changed</p>
                </div>
                <div className="alert alert-success">
                  <strong>Success!</strong><br />
                  Your password has been reset. Redirecting you to login...
                </div>
              </div>
            ) : (
              <div>
                <div className="auth-card-header">
                  <h2 className="auth-card-title">Set New Password</h2>
                  <p className="auth-card-subtitle">Enter your new password below</p>
                </div>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                  <div className="form-group">
                    <label className="form-label" htmlFor="password">New Password</label>
                    <input
                      type="password"
                      className="form-input"
                      id="password"
                      name="password"
                      placeholder="Enter new password"
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
                      placeholder="Confirm new password"
                      value={this.state.confirmPassword}
                      onChange={this.handleChange}
                      required
                      minLength={8}
                      autoComplete="new-password"
                    />
                  </div>
                  <button type="submit" className="btn-primary" disabled={this.state.loading}>
                    {this.state.loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                  {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
