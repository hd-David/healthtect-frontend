import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

class CreateHospital extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      address: '',
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
      const response = await fetch('http://localhost:8000/api/hospitals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.props.token}`,
        },
        body: JSON.stringify({
          name: this.state.name,
          address: this.state.address,
        }),
      });
      if (response.ok) {
        this.setState({ success: true, loading: false, name: '', address: '' });
        if (this.props.onCreated) this.props.onCreated();
      } else {
        const data = await response.json();
        this.setState({ error: data.error || 'Hospital creation failed', loading: false });
      }
    } catch (err) {
      this.setState({ error: 'Hospital creation failed', loading: false });
    }
  };

  render() {
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
              <Link to="/create-hospital" className="nav-item active">
                <span className="nav-item-icon">🏨</span>
                Create Hospital
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="main-content">
          <header className="top-header">
            <div className="header-left">
              <h1 className="page-title">Create Hospital</h1>
            </div>
            <div className="header-right">
              <Link to="/dashboard">
                <button className="btn-logout">← Back to Dashboard</button>
              </Link>
            </div>
          </header>

          <div className="page-content">
            <div className="form-card-wrapper">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3 className="card-title">
                    <span className="card-title-icon stat-icon purple">🏨</span>
                    Hospital Information
                  </h3>
                </div>
                <div className="card-body">
                  <form onSubmit={this.handleSubmit} autoComplete="off">
                    <div className="form-group">
                      <label className="form-label" htmlFor="name">Hospital Name</label>
                      <input
                        type="text"
                        className="form-input"
                        id="name"
                        name="name"
                        placeholder="Enter hospital name"
                        value={this.state.name}
                        onChange={this.handleChange}
                        required
                        autoComplete="organization"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" htmlFor="address">Address</label>
                      <input
                        type="text"
                        className="form-input"
                        id="address"
                        name="address"
                        placeholder="Enter hospital address"
                        value={this.state.address}
                        onChange={this.handleChange}
                        required
                        autoComplete="street-address"
                      />
                    </div>
                    <button type="submit" className="btn-primary" disabled={this.state.loading}>
                      {this.state.loading ? 'Creating...' : 'Create Hospital'}
                    </button>
                    {this.state.error && <div className="alert alert-error">{this.state.error}</div>}
                    {this.state.success && <div className="alert alert-success">Hospital created successfully!</div>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateHospital;
