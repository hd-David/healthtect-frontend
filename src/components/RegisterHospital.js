import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class RegisterHospital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      hospitalType: 'private',
      address: '',
      contactPhone: '',
      contactEmail: '',
      registrationNumber: '',
      tpin: '',
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
      const response = await fetch('http://localhost:8000/api/register-hospital/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.token}`,
        },
        body: JSON.stringify({
          name: this.state.name,
          hospital_type: this.state.hospitalType,
          address: this.state.address,
          contact_phone: this.state.contactPhone,
          contact_email: this.state.contactEmail,
          registration_number: this.state.registrationNumber,
          tpin: this.state.tpin,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        this.setState({ success: true, loading: false });
        
        // Update user info with the new hospital and admin status
        if (this.props.onHospitalRegistered && data.user) {
          this.props.onHospitalRegistered(data.user);
        }
        
        // Redirect to dashboard after short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1500);
      } else {
        const data = await response.json();
        let errorMsg = 'Hospital registration failed';
        if (data && data.name && Array.isArray(data.name)) {
          errorMsg = data.name.join(' ');
        } else if (data && data.error) {
          errorMsg = data.error;
        } else if (data && data.detail) {
          errorMsg = data.detail;
        } else if (typeof data === 'string') {
          errorMsg = data;
        }
        this.setState({ error: errorMsg, loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Hospital registration failed. Please try again.', loading: false });
    }
  };

  handleLogout = () => {
    if (this.props.onLogout) {
      this.props.onLogout();
    }
    window.location.href = '/login';
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
              Complete your setup by registering your hospital. This information helps us provide better service and ensures compliance with healthcare regulations.
            </p>
            <ul className="auth-features">
              <li>Full Hospital Management</li>
              <li>Multi-user Support</li>
              <li>HIPAA Compliant Platform</li>
              <li>AI-Powered Imaging Analysis</li>
            </ul>
          </div>
        </div>
        <div className="auth-main">
          <div className="auth-card" style={{ maxWidth: '520px' }}>
            <div className="auth-card-header">
              <h2 className="auth-card-title">Hospital Registration</h2>
              <p className="auth-card-subtitle">Enter your hospital details to continue</p>
            </div>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <div className="form-group">
                <label className="form-label" htmlFor="name">Hospital Name *</label>
                <input
                  type="text"
                  className="form-input"
                  id="name"
                  name="name"
                  placeholder="Enter hospital name"
                  value={this.state.name}
                  onChange={this.handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="hospitalType">Hospital Type *</label>
                <select
                  className="form-input"
                  id="hospitalType"
                  name="hospitalType"
                  value={this.state.hospitalType}
                  onChange={this.handleChange}
                  required
                >
                  <option value="private">Private</option>
                  <option value="public">Public</option>
                  <option value="ngo">NGO</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="address">Address *</label>
                <textarea
                  className="form-input"
                  id="address"
                  name="address"
                  placeholder="Enter hospital address"
                  value={this.state.address}
                  onChange={this.handleChange}
                  required
                  rows="2"
                  style={{ resize: 'vertical', minHeight: '60px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactPhone">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    id="contactPhone"
                    name="contactPhone"
                    placeholder="e.g. +260 XXX XXX XXX"
                    value={this.state.contactPhone}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contactEmail">Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    id="contactEmail"
                    name="contactEmail"
                    placeholder="hospital@example.com"
                    value={this.state.contactEmail}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="registrationNumber">Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    id="registrationNumber"
                    name="registrationNumber"
                    placeholder="Hospital reg. number"
                    value={this.state.registrationNumber}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="tpin">TPIN</label>
                  <input
                    type="text"
                    className="form-input"
                    id="tpin"
                    name="tpin"
                    placeholder="Tax payer ID"
                    value={this.state.tpin}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={this.state.loading}>
                {this.state.loading ? 'Registering Hospital...' : 'Register Hospital'}
              </button>
              
              {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
              {this.state.success && <div className="alert alert-success">Hospital registered successfully! Redirecting to dashboard...</div>}
            </form>
            <div className="auth-footer">
              <p>
                <button 
                  onClick={this.handleLogout} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary)', 
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Logout
                </button>
                {' '}and sign in with a different account
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterHospital;
