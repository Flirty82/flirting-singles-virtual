
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/UI/Button';
import './Pages.css';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Find Your Perfect
              <span className="highlight"> Match</span>
            </h1>
            <p className="hero-subtitle">
              Connect with amazing people, share your stories, and discover meaningful relationships in our vibrant community.
            </p>
            <div className="hero-buttons">
              <Link to="/signup">
                <Button variant="primary" size="large">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="large">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-graphic">
              <div className="floating-hearts">
                <span className="heart">💖</span>
                <span className="heart">💕</span>
                <span className="heart">💗</span>
                <span className="heart">💝</span>
              </div>
              <div className="hero-illustration">
                <div className="illustration-card">
                  <div className="card-avatar">👤</div>
                  <div className="card-content">
                    <div className="card-line"></div>
                    <div className="card-line short"></div>
                  </div>
                </div>
                <div className="illustration-card">
                  <div className="card-avatar">👤</div>
                  <div className="card-content">
                    <div className="card-line"></div>
                    <div className="card-line short"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose LoveConnect?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Matching</h3>
              <p>Our advanced algorithm helps you find compatible matches based on your interests and preferences.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Real-time Chat</h3>
              <p>Connect instantly with your matches through our seamless messaging platform.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🛡️</div>
              <h3>Safe & Secure</h3>
              <p>Your privacy and safety are our top priorities with advanced security features.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Authentic Profiles</h3>
              <p>Verified profiles ensure you're connecting with real people looking for genuine relationships.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Find Love?</h2>
            <p>Join thousands of happy couples who found their match on LoveConnect</p>
            <Link to="/signup">
              <Button variant="primary" size="large">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
