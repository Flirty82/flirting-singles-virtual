import React from 'react';

const HomePage = ({ setCurrentPage }) => {
  return (
    <div className="container">
      <section className="hero">
        <h1>Find Your Perfect Match</h1>
        <p>Connect, Chat, and Create Lasting Relationships</p>
        <button className="btn btn-primary" onClick={() => setCurrentPage('signup')}>
          Get Started Today
        </button>
      </section>
      
      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💕</div>
          <h3>Smart Matching</h3>
          <p>Our advanced algorithm finds your perfect compatibility based on interests and personality.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎵</div>
          <h3>Virtual Karaoke</h3>
          <p>Break the ice with virtual karaoke sessions and discover shared musical tastes.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎲</div>
          <h3>Virtual Bingo</h3>
          <p>Have fun together with virtual bingo games and interactive entertainment.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Secure Messaging</h3>
          <p>Private and group messaging with advanced privacy controls and encryption.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🌟</div>
          <h3>Activity Feed</h3>
          <p>Share your thoughts, photos, and connect with the community through posts.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎶</div>
          <h3>Music Integration</h3>
          <p>Share your favorite music and discover new songs through our integrated music platform.</p>
        </div>
      </div>
    </div>
  );
};