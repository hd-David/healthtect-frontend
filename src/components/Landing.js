import React from 'react';
import { Link } from 'react-router-dom';
import '../FormStyles.css';

function Landing() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-nav-container">
          <div className="landing-nav-brand">
            <span className="landing-nav-icon">🏥</span>
            <span className="landing-nav-logo">Healthtect</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features">Features</a>
            <a href="#benefits">Benefits</a>
            <a href="#ai">AI Technology</a>
            <Link to="/login" className="landing-nav-btn">Sign In</Link>
            <Link to="/register" className="landing-nav-btn primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-bg"></div>
        <div className="landing-hero-content">
          <div className="landing-hero-badge">🚀 Trusted by 500+ Healthcare Facilities</div>
          <h1 className="landing-hero-title">
            Transform Your Hospital with <span className="gradient-text">AI-Powered</span> Medical Imaging
          </h1>
          <p className="landing-hero-subtitle">
            Healthtect revolutionizes healthcare management by combining cutting-edge AI diagnostics 
            with seamless hospital operations. Faster diagnoses, better outcomes, happier patients.
          </p>
          <div className="landing-hero-cta">
            <Link to="/register" className="landing-btn primary large">
              Register Your Hospital
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/login" className="landing-btn outline large">
              Sign In to Dashboard
            </Link>
          </div>
          <div className="landing-hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">98%</span>
              <span className="hero-stat-label">Diagnostic Accuracy</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">60%</span>
              <span className="hero-stat-label">Faster Results</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">24/7</span>
              <span className="hero-stat-label">AI Availability</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="landing-features" id="features">
        <div className="landing-container">
          <div className="landing-section-header">
            <span className="landing-section-badge">Features</span>
            <h2 className="landing-section-title">Everything You Need to Run a Modern Hospital</h2>
            <p className="landing-section-subtitle">
              From patient intake to AI-powered diagnostics, Healthtect provides a complete solution 
              for healthcare management.
            </p>
          </div>
          <div className="landing-features-grid">
            <div className="landing-feature-card">
              <div className="feature-icon purple">🔬</div>
              <h3>Medical Imaging Management</h3>
              <p>Centralize all imaging studies - CT, MRI, X-Ray, Ultrasound - in one secure, DICOM-compliant platform.</p>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon blue">🤖</div>
              <h3>AI-Powered Analysis</h3>
              <p>Our AI algorithms detect anomalies, prioritize critical cases, and assist radiologists with preliminary findings.</p>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon green">👥</div>
              <h3>User & Role Management</h3>
              <p>Granular access controls ensure the right people see the right data. HIPAA-compliant by design.</p>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon orange">📊</div>
              <h3>Analytics & Reporting</h3>
              <p>Real-time dashboards and compliance reports help you make data-driven decisions.</p>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon pink">🔒</div>
              <h3>Enterprise Security</h3>
              <p>End-to-end encryption, audit logs, and multi-factor authentication protect sensitive patient data.</p>
            </div>
            <div className="landing-feature-card">
              <div className="feature-icon teal">🌐</div>
              <h3>Multi-Hospital Support</h3>
              <p>Manage multiple facilities from a single dashboard with centralized or distributed administration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="landing-benefits" id="benefits">
        <div className="landing-container">
          <div className="landing-benefits-content">
            <div className="landing-benefits-text">
              <span className="landing-section-badge">Why Healthtect</span>
              <h2 className="landing-section-title">Reduce Costs. Save Lives. Scale Effortlessly.</h2>
              <div className="benefit-list">
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Reduce Diagnostic Time by 60%</h4>
                    <p>AI pre-screening and automated workflows mean faster turnaround from scan to diagnosis.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Lower Operational Costs</h4>
                    <p>Streamlined processes and reduced manual work translate to significant cost savings.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Improve Patient Outcomes</h4>
                    <p>Earlier detection of critical findings means earlier intervention and better patient care.</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Stay Compliant Automatically</h4>
                    <p>Built-in HIPAA compliance, audit trails, and regulatory reporting features.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="landing-benefits-visual">
              <div className="benefits-card">
                <div className="benefits-card-header">
                  <span className="benefits-card-icon">📈</span>
                  <span>Performance Metrics</span>
                </div>
                <div className="benefits-metric">
                  <div className="metric-bar">
                    <div className="metric-fill" style={{ width: '98%' }}></div>
                  </div>
                  <div className="metric-info">
                    <span>AI Accuracy</span>
                    <span className="metric-value">98%</span>
                  </div>
                </div>
                <div className="benefits-metric">
                  <div className="metric-bar">
                    <div className="metric-fill blue" style={{ width: '85%' }}></div>
                  </div>
                  <div className="metric-info">
                    <span>Time Saved</span>
                    <span className="metric-value">85%</span>
                  </div>
                </div>
                <div className="benefits-metric">
                  <div className="metric-bar">
                    <div className="metric-fill green" style={{ width: '92%' }}></div>
                  </div>
                  <div className="metric-info">
                    <span>User Satisfaction</span>
                    <span className="metric-value">92%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="landing-ai" id="ai">
        <div className="landing-container">
          <div className="landing-section-header light">
            <span className="landing-section-badge light">AI Technology</span>
            <h2 className="landing-section-title">Powered by Advanced Machine Learning</h2>
            <p className="landing-section-subtitle">
              Our proprietary AI models are trained on millions of medical images and continuously 
              improve to deliver state-of-the-art diagnostic assistance.
            </p>
          </div>
          <div className="landing-ai-grid">
            <div className="ai-capability">
              <div className="ai-icon">🧠</div>
              <h4>Deep Learning Models</h4>
              <p>Neural networks trained on diverse, anonymized datasets for maximum accuracy.</p>
            </div>
            <div className="ai-capability">
              <div className="ai-icon">⚡</div>
              <h4>Real-Time Processing</h4>
              <p>Get AI insights within seconds of uploading a study.</p>
            </div>
            <div className="ai-capability">
              <div className="ai-icon">🎯</div>
              <h4>Anomaly Detection</h4>
              <p>Automatically flag suspicious findings for priority review.</p>
            </div>
            <div className="ai-capability">
              <div className="ai-icon">📋</div>
              <h4>Structured Reports</h4>
              <p>AI-generated preliminary reports save radiologists hours of work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta-content">
            <h2>Ready to Transform Your Healthcare Facility?</h2>
            <p>Join hundreds of hospitals already using Healthtect to deliver better patient care.</p>
            <div className="landing-cta-buttons">
              <Link to="/register" className="landing-btn white large">
                Register Your Hospital
                <span className="btn-arrow">→</span>
              </Link>
              <a href="mailto:sales@healthtect.com" className="landing-btn outline-white large">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="landing-footer-grid">
            <div className="landing-footer-brand">
              <div className="landing-nav-brand">
                <span className="landing-nav-icon">🏥</span>
                <span className="landing-nav-logo">Healthtect</span>
              </div>
              <p>Transforming healthcare through AI-powered medical imaging and intelligent hospital management.</p>
            </div>
            <div className="landing-footer-links">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#ai">AI Technology</a>
              <a href="#benefits">Benefits</a>
            </div>
            <div className="landing-footer-links">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#careers">Careers</a>
              <a href="#contact">Contact</a>
            </div>
            <div className="landing-footer-links">
              <h4>Legal</h4>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#hipaa">HIPAA Compliance</a>
            </div>
          </div>
          <div className="landing-footer-bottom">
            <p>© 2026 Healthtect. All rights reserved.</p>
            <div className="landing-footer-social">
              <a href="#linkedin">LinkedIn</a>
              <a href="#twitter">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
