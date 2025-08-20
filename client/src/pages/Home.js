// frontend/src/pages/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiUsers, 
  FiMessageCircle, 
  FiVideo, 
  FiShield,
  FiStar,
  FiTrendingUp,
  FiSmile,
  FiGlobe,
  FiArrowRight,
  FiPlay,
  FiCheck,
  FiCrown
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({
    members: 0,
    matches: 0,
    messages: 0,
    success: 0
  });

  // Animate stats on load
  useEffect(() => {
    const targetStats = {
      members: 2500000,
      matches: 1200000,
      messages: 45000000,
      success: 87
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // 60 steps for smooth animation
    const increment = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        members: Math.floor(targetStats.members * progress),
        matches: Math.floor(targetStats.matches * progress),
        messages: Math.floor(targetStats.messages * progress),
        success: Math.floor(targetStats.success * progress)
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targetStats);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const testimonials = [
    {
      name: "Sarah & Michael",
      image: "/images/testimonial1.jpg",
      story: "We met on FlirtingSingles 2 years ago and got married last month! The platform helped us find exactly what we were looking for.",
      location: "Austin, TX",
      duration: "2 years together"
    },
    {
      name: "Jessica & David",
      image: "/images/testimonial2.jpg",
      story: "I never thought online dating would work for me, but FlirtingSingles proved me wrong. We're planning our future together!",
      location: "Miami, FL",
      duration: "18 months together"
    },
    {
      name: "Amanda & Ryan",
      image: "/images/testimonial3.jpg",
      story: "The quality of people on FlirtingSingles is amazing. We connected over our shared love of travel and haven't looked back since.",
      location: "Seattle, WA",
      duration: "1 year together"
    }
  ];

  const features = [
    {
      icon: <FiUsers />,
      title: "Smart Matching",
      description: "Advanced algorithm finds your perfect match based on compatibility, interests, and preferences."
    },
    {
      icon: <FiMessageCircle />,
      title: "Secure Messaging",
      description: "Chat safely with end-to-end encryption and advanced privacy controls."
    },
    {
      icon: <FiVideo />,
      title: "Video Dating",
      description: "Meet face-to-face with HD video calls before your first in-person date."
    },
    {
      icon: <FiShield />,
      title: "Safety First",
      description: "Verified profiles, background checks, and 24/7 safety monitoring."
    },
    {
      icon: <FiGlobe />,
      title: "Global Community",
      description: "Connect with singles worldwide or find someone in your local area."
    },
    {
      icon: <FiStar />,
      title: "Premium Experience",
      description: "Unlock advanced features with our Gold, Platinum, and Diamond memberships."
    }
  ];

  const membershipPlans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      features: [
        "Create profile",
        "Browse matches",
        "Limited messaging",
        "Basic filters"
      ],
      color: "#6c757d",
      popular: false
    },
    {
      name: "Gold",
      price: "$19.99",
      period: "per month",
      features: [
        "Unlimited messaging",
        "See who liked you",
        "Advanced filters",
        "Read receipts"
      ],
      color: "#ffd700",
      popular: true
    },
    {
      name: "Platinum",
      price: "$29.99",
      period: "per month",
      features: [
        "All Gold features",
        "Video chat",
        "Profile boost",
        "Message priority"
      ],
      color: "#e5e4e2",
      popular: false
    },
    {
      name: "Diamond",
      price: "$49.99",
      period: "per month",
      features: [
        "All Platinum features",
        "VIP profile badge",
        "Exclusive events",
        "Personal matchmaker"
      ],
      color: "#b9f2ff",
      popular: false
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num.toString();
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Find Your Perfect Match on
                <span className="brand-highlight"> FlirtingSingles</span>
              </h1>
              <p className="hero-subtitle">
                Join millions of singles who have found love, friendship, and meaningful 
                connections. Your soulmate is just a click away.
              </p>
              
              <div className="hero-cta">
                <button 
                  onClick={handleGetStarted}
                  className="cta-button primary"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Join Free Today'}
                  <FiArrowRight className="button-icon" />
                </button>
                
                {!isAuthenticated && (
                  <Link to="/login" className="cta-button secondary">
                    Sign In
                  </Link>
                )}
              </div>

              <div className="hero-features">
                <div className="feature-item">
                  <FiCheck className="feature-icon" />
                  <span>100% Free to Join</span>
                </div>
                <div className="feature-item">
                  <FiCheck className="feature-icon" />
                  <span>Verified Profiles</span>
                </div>
                <div className="feature-item">
                  <FiCheck className="feature-icon" />
                  <span>Safe & Secure</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="hero-image">
                <img src="/images/hero-couple.jpg" alt="Happy couple" />
                <div className="floating-card card-1">
                  <FiHeart className="card-icon" />
                  <span>New Match!</span>
                </div>
                <div className="floating-card card-2">
                  <FiMessageCircle className="card-icon" />
                  <span>5 New Messages</span>
                </div>
                <div className="floating-card card-3">
                  <FiVideo className="card-icon" />
                  <span>Video Date</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{formatNumber(stats.members)}</div>
              <div className="stat-label">Active Members</div>
              <FiUsers className="stat-icon" />
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatNumber(stats.matches)}</div>
              <div className="stat-label">Successful Matches</div>
              <FiHeart className="stat-icon" />
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatNumber(stats.messages)}</div>
              <div className="stat-label">Messages Sent</div>
              <FiMessageCircle className="stat-icon" />
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.success}%</div>
              <div className="stat-label">Success Rate</div>
              <FiTrendingUp className="stat-icon" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose FlirtingSingles?</h2>
            <p>Discover the features that make us the #1 choice for finding love</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How FlirtingSingles Works</h2>
            <p>Finding love has never been easier with our simple 4-step process</p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Profile</h3>
                <p>Sign up for free and create an attractive profile that showcases the real you</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Browse & Match</h3>
                <p>Use our smart matching algorithm to find compatible singles in your area</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Connect & Chat</h3>
                <p>Send messages, flirts, and video chat with your matches safely and securely</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Meet & Date</h3>
                <p>Plan your first date and start building a meaningful relationship</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories</h2>
            <p>Real couples who found love on FlirtingSingles</p>
          </div>

          <div className="testimonial-container">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="quote-icon">❝</div>
                <p className="testimonial-text">
                  {testimonials[currentTestimonial].story}
                </p>
                <div className="testimonial-author">
                  <img 
                    src={testimonials[currentTestimonial].image} 
                    alt={testimonials[currentTestimonial].name}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="author-placeholder">
                    <FiHeart />
                  </div>
                  <div className="author-info">
                    <h4>{testimonials[currentTestimonial].name}</h4>
                    <p>{testimonials[currentTestimonial].location}</p>
                    <span>{testimonials[currentTestimonial].duration}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Membership Plans */}
      <section className="membership-section">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Plan</h2>
            <p>Unlock premium features and find love faster</p>
          </div>

          <div className="plans-grid">
            {membershipPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                
                <div className="plan-header">
                  <h3 style={{ color: plan.color }}>{plan.name}</h3>
                  {plan.name !== 'Free' && <FiCrown style={{ color: plan.color }} />}
                </div>
                
                <div className="plan-price">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                
                <ul className="plan-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>
                      <FiCheck className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to={plan.name === 'Free' ? '/register' : '/membership'}
                  className={`plan-button ${plan.popular ? 'primary' : 'secondary'}`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <FiHeart className="cta-icon" />
            <h2>Ready to Find Your Perfect Match?</h2>
            <p>Join millions of singles and start your love story today!</p>
            <button 
              onClick={handleGetStarted}
              className="cta-button large"
            >
              {isAuthenticated ? 'Continue Your Journey' : 'Start Your Love Story'}
              <FiArrowRight className="button-icon" />
            </button>
            <p className="cta-note">
              <FiShield className="note-icon" />
              100% Safe & Secure • No Hidden Fees • Cancel Anytime
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;