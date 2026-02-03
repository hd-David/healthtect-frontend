import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
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
      const response = await fetch('http://localhost:8000/api/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: this.state.email,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        this.setState({ 
          success: true, 
          loading: false,
          email: ''
        });
      } else {
        const errorMsg = data.error || data.detail || 'Failed to send reset email. Please try again.';
        this.setState({ error: errorMsg, loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Failed to send reset email. Please try again.', loading: false });
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
            <h1>Reset Your Password</h1>
            <p>
              Forgot your password? No worries! Enter your email address and we'll send you a secure link to reset your password.
            </p>
            <ul className="auth-features">
              <li>Secure Password Reset</li>
              <li>Email Verification</li>
              <li>Link Expires in 24 Hours</li>
              <li>HIPAA Compliant Process</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">Forgot Password?</h2>
              <p className="auth-card-subtitle">Enter your email to receive a reset link</p>
            </div>
            {this.state.success ? (
              <div>
                <div className="alert alert-success">
                  <strong>Check your email!</strong><br />
                  If an account exists with that email, we've sent a password reset link. 
                  Please check your inbox and spam folder.
                </div>
                <div className="auth-footer" style={{ marginTop: '24px' }}>
                  <p><Link to="/login">← Back to Login</Link></p>
                </div>
              </div>
            ) : (
              <form onSubmit={this.handleSubmit} autoComplete="off">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    id="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={this.state.email}
                    onChange={this.handleChange}
                    required
                    autoComplete="email"
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={this.state.loading}>
                  {this.state.loading ? 'Sending...' : 'Send Reset Link'}
                </button>
                {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
                <div className="auth-footer">
                  <p>Remember your password? <Link to="/login">Sign in</Link></p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
