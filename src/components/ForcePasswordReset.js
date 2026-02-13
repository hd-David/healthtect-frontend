import React, { Component } from 'react';
import '../FormStyles.css';

/**
 * Force password reset screen for users who logged in with a temporary password.
 * Uses authenticated change-password endpoint requiring current password.
 */
class ForcePasswordReset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      loading: false,
      error: '',
      success: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = this.state;

    if (newPassword !== confirmPassword) {
      this.setState({ error: 'Passwords do not match' });
      return;
    }
    if (newPassword.length < 8) {
      this.setState({ error: 'Password must be at least 8 characters' });
      return;
    }

    this.setState({ loading: true, error: '', success: false });
    try {
      const response = await fetch('http://localhost:8000/api/users/me/password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.token}`,
        },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirm: confirmPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        this.setState({ success: true, loading: false });
        if (this.props.onPasswordResetComplete) {
          this.props.onPasswordResetComplete();
        }
        // Redirect after short delay
        setTimeout(() => {
          window.location.href = this.props.user?.hospital_id ? '/dashboard' : '/register-hospital';
        }, 1200);
      } else {
        const errorMsg =
          typeof data?.error === 'string' ? data.error
          : typeof data?.detail === 'string' ? data.detail
          : data?.error?.message || data?.detail?.message || data?.message || 'Failed to update password';
        this.setState({ error: errorMsg, loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Failed to update password', loading: false });
    }
  };

  render() {
    const { user } = this.props;
    return (
      <div className="auth-wrapper">
        <div className="auth-sidebar">
          <div className="auth-sidebar-content">
            <div className="auth-brand">
              <div className="auth-brand-icon">🏥</div>
              <span className="auth-brand-text">Healthtect</span>
            </div>
            <h1>Set a Permanent Password</h1>
            <p>
              You signed in with a temporary password. For security, please set a new one to continue.
            </p>
            <ul className="auth-features">
              <li>Minimum 8 characters</li>
              <li>Use letters, numbers, symbols</li>
              <li>Applies to your account immediately</li>
              <li>Required before accessing the dashboard</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card" style={{ maxWidth: '520px' }}>
            <div className="auth-card-header">
              <h2 className="auth-card-title">Update Password</h2>
              <p className="auth-card-subtitle">
                {user?.email ? `Account: ${user.email}` : 'Enter your current temporary password first'}
              </p>
            </div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <div className="form-group">
                <label className="form-label" htmlFor="currentPassword">Current (Temporary) Password</label>
                <input
                  type="password"
                  className="form-input"
                  id="currentPassword"
                  name="currentPassword"
                  value={this.state.currentPassword}
                  onChange={this.handleChange}
                  required
                  autoComplete="current-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  className="form-input"
                  id="newPassword"
                  name="newPassword"
                  value={this.state.newPassword}
                  onChange={this.handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  className="form-input"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>
              <button type="submit" className="btn-primary" disabled={this.state.loading}>
                {this.state.loading ? 'Updating...' : 'Update Password'}
              </button>
              {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
              {this.state.success && <div className="alert alert-success">Password updated. Redirecting…</div>}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ForcePasswordReset;
