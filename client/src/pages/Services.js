// frontend/src/pages/Services.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiMessageCircle, 
  FiVideo, 
  FiShield,
  FiHeart,
  FiSearch,
  FiStar,
  FiCalendar,
  FiTrendingUp,
  FiGlobe,
  FiCamera,
  FiUserCheck,
  FiHeadphones,
  FiGift,
  FiCrown,
  FiCheck,
  FiArrowRight,
  FiPlay,
  FiPhoneCall
} from 'react-icons/fi';
import './Services.css';

const Services = () => {
  const [activeTab, setActiveTab] = useState('matching');

  const services = {
    matching: {
      title: "Smart Matching",
      icon: <FiUsers />,
      description: "Advanced algorithm-based matching system",
      features: [
        {
          icon: <FiSearch />,
          title: "Advanced Search Filters",
          description: "Filter by age, location, interests, lifestyle, and more",
          premium: false
        },
        {
          icon: <FiTrendingUp />,
          title: "Compatibility Score",
          description: "AI-powered compatibility analysis based on 100+ factors",
          premium: true
        },
        {
          icon: <FiHeart />,
          title: "Daily Matches",
          description: "Curated matches delivered to your inbox every day",
          premium: false
        },
        {
          icon: <FiStar />,
          title: "Premium Matching",
          description: "Enhanced algorithm with priority matching for premium members",
          premium: true
        }
      ]
    },
    communication: {
      title: "Communication Tools",
      icon: <FiMessageCircle />,
      description: "Connect and chat with your matches safely",
      features: [
        {
          icon: <FiMessageCircle />,
          title: "Secure Messaging",
          description: "End-to-end encrypted messaging with photo and GIF support",
          premium: false
        },
        {
          icon: <FiVideo />,
          title: "Video Chat",
          description: "HD video calls with filters and virtual backgrounds",
          premium: true
        },
        {
          icon: <FiPhoneCall />,
          title: "Voice Calls",
          description: "High-quality voice calls without sharing phone numbers",
          premium: true
        },
        {
          icon: <FiGift />,
          title: "Virtual Gifts",
          description: "Send virtual flowers, chocolates, and other romantic gifts",
          premium: true
        }
      ]
    },
    safety: {
      title: "Safety & Security",
      icon: <FiShield />,
      description: "Your safety is our top priority",
      features: [
        {
          icon: <FiUserCheck />,
          title: "Profile Verification",
          description: "Photo verification and background checks for verified badges",
          premium: false
        },
        {
          icon: <FiShield />,
          title: "Privacy Controls",
          description: "Control who can see your profile and contact you",
          premium: false
        },
        {
          icon: <FiHeadphones />,
          title: "24/7 Support",
          description: "Round-the-clock customer support and safety monitoring",
          premium: false
        },
        {
          icon: <FiGlobe />,
          title: "Location Privacy",
          description: "Hide exact location while still finding nearby matches",
          premium: true
        }
      ]
    },
    premium: {
      title: "Premium Features",
      icon: <FiCrown />,
      description: "Unlock the full potential of FlirtingSingles",
      features: [
        {
          icon: <FiStar />,
          title: "Profile Boost",
          description: "Get 10x more profile views with priority placement",
          premium: true
        },
        {
          icon: <FiCalendar />,
          title: "Date Planning",
          description: "AI-powered date suggestions and reservation assistance",
          premium: true
        },
        {
          icon: <FiTrendingUp />,
          title: "Analytics Dashboard",
          description: "Detailed insights on your profile performance and matches",
          premium: true
        },
        {
          icon: <FiGift />,
          title: "Exclusive Events",
          description: "VIP access to singles events and meetups",
          premium: true
        }
      ]
    }
  };

  const membershipPlans = [
    {
      name: "Free",
      price: "$0",
      period: "Forever",
      color: "#6c757d",
      popular: false,
      features: [
        "Create detailed profile",
        "Browse unlimited profiles",
        "Send up to 5 messages/day",
        "Basic search filters",
        "Safety features",
        "Mobile app access"
      ],
      limitations: [
        "Limited messaging",
        "No video chat",
        "No profile boost",
        "Standard support"
      ]
    },
    {
      name: "Gold",
      price: "$19.99",
      period: "per month",
      color: "#ffd700",
      popular: true,
      features: [
        "Everything in Free",
        "Unlimited messaging",
        "See who liked you",
        "Advanced search filters",
        "Read receipts",
        "Priority customer support"
      ],
      limitations: [
        "No video chat",
        "Limited profile boosts"
      ]
    },
    {
      name: "Platinum",
      price: "$29.99",
      period: "per month",
      color: "#e5e4e2",
      popular: false,
      features: [
        "Everything in Gold",
        "HD video chat",
        "Voice calls",
        "Profile boost (5x monthly)",
        "Message priority",
        "Virtual gifts",
        "Advanced privacy controls"
      ],
      limitations: [
        "Limited exclusive events"
      ]
    },
    {
      name: "Diamond",
      price: "$49.99",
      period: "per month",
      color: "#b9f2ff",
      popular: false,
      features: [
        "Everything in Platinum",
        "VIP profile badge",
        "Unlimited profile boosts",
        "Personal matchmaker",
        "Exclusive events access",
        "Date planning assistance",
        "Analytics dashboard"
      ],
      limitations: []
    }
  ];

  const additionalServices = [
    {
      icon: <FiCamera />,
      title: "Professional Photo Shoot",
      description: "Professional photography service to create stunning profile photos",
      price: "$199",
      features: [
        "2-hour photo session",
        "Professional photographer",
        "10+ edited photos",
        "Multiple outfit changes",
        "Indoor & outdoor shots"
      ]
    },
    {
      icon: <FiUserCheck />,
      title: "Profile Optimization",
      description: "Expert profile review and optimization service",
      price: "$99",
      features: [
        "Professional profile review",
        "Bio writing assistance",
        "Photo selection guidance",
        "Matching strategy tips",
        "30-day follow-up"
      ]
    },
    {
      icon: <FiHeadphones />,
      title: "Dating Coach",
      description: "One-on-one coaching sessions with certified dating experts",
      price: "$149",
      features: [
        "1-hour video consultation",
        "Personalized dating strategy",
        "Communication tips",
        "Confidence building",
        "Follow-up sessions available"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Emily R.",
      service: "Profile Optimization",
      rating: 5,
      review: "My profile got 300% more views after the optimization service. Totally worth it!",
      image: "/images/testimonial-emily.jpg"
    },
    {
      name: "David M.",
      service: "Dating Coach",
      rating: 5,
      review: "The dating coach helped me build confidence and I found my soulmate within 2 months!",
      image: "/images/testimonial-david.jpg"
    },
    {
      name: "Sarah K.",
      service: "Professional Photos",
      rating: 5,
      review: "The photos are amazing! I went from 2 matches a week to 20+. Game changer!",
      image: "/images/testimonial-sarah.jpg"
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        
        <div className="container">
          <div className="hero-content">
            <h1>Our Services</h1>
            <p>
              Comprehensive tools and features designed to help you find meaningful 
              connections and build lasting relationships.
            </p>
            <div className="hero-stats">
              <div className="stat">
                <span className="number">2.5M+</span>
                <span className="label">Active Users</span>
              </div>
              <div className="stat">
                <span className="number">87%</span>
                <span className="label">Success Rate</span>
              </div>
              <div className="stat">
                <span className="number">24/7</span>
                <span className="label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container">
        {/* Services Navigation */}
        <section className="services-nav-section">
          <div className="services-tabs">
            {Object.entries(services).map(([key, service]) => (
              <button
                key={key}
                className={`tab-button ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                <div className="tab-icon">{service.icon}</div>
                <span>{service.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Active Service Details */}
        <section className="service-details">
          <div className="service-header">
            <div className="service-icon">
              {services[activeTab].icon}
            </div>
            <div className="service-info">
              <h2>{services[activeTab].title}</h2>
              <p>{services[activeTab].description}</p>
            </div>
          </div>

          <div className="features-grid">
            {services[activeTab].features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-header">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  {feature.premium && (
                    <div className="premium-badge">
                      <FiCrown />
                      Premium
                    </div>
                  )}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Membership Plans */}
        <section className="membership-plans-section">
          <div className="section-header">
            <h2>Choose Your Plan</h2>
            <p>Find the perfect plan that matches your dating goals</p>
          </div>

          <div className="plans-comparison">
            {membershipPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`plan-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && (
                  <div className="popular-ribbon">Most Popular</div>
                )}
                
                <div className="plan-header">
                  <h3 style={{ color: plan.color }}>{plan.name}</h3>
                  {plan.name !== 'Free' && (
                    <FiCrown style={{ color: plan.color }} />
                  )}
                </div>
                
                <div className="plan-pricing">
                  <span className="price">{plan.price}</span>
                  <span className="period">{plan.period}</span>
                </div>
                
                <div className="plan-features">
                  <h4>What's Included:</h4>
                  <ul className="included-features">
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>
                        <FiCheck className="check-icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {plan.limitations.length > 0 && (
                    <>
                      <h4>Limitations:</h4>
                      <ul className="limitations">
                        {plan.limitations.map((limitation, idx) => (
                          <li key={idx}>
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                
                <Link 
                  to={plan.name === 'Free' ? '/register' : '/membership'}
                  className={`plan-cta ${plan.popular ? 'primary' : 'secondary'}`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Choose Plan'}
                  <FiArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="additional-services">
          <div className="section-header">
            <h2>Additional Services</h2>
            <p>Professional services to boost your dating success</p>
          </div>

          <div className="services-grid">
            {additionalServices.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-card-header">
                  <div className="service-card-icon">
                    {service.icon}
                  </div>
                  <div className="service-price">{service.price}</div>
                </div>
                
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <FiCheck className="check-icon" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="service-cta">
                  Learn More
                  <FiArrowRight />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="how-it-works">
          <div className="section-header">
            <h2>How Our Platform Works</h2>
            <p>Simple steps to find your perfect match</p>
          </div>

          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Create Your Profile</h3>
                <p>Build an attractive profile with photos and detailed information about yourself</p>
              </div>
            </div>
            
            <div className="step-arrow">
              <FiArrowRight />
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Get Matched</h3>
                <p>Our AI algorithm finds compatible matches based on your preferences</p>
              </div>
            </div>
            
            <div className="step-arrow">
              <FiArrowRight />
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Start Chatting</h3>
                <p>Connect with your matches through secure messaging and video calls</p>
              </div>
            </div>
            
            <div className="step-arrow">
              <FiArrowRight />
            </div>
            
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Meet in Person</h3>
                <p>Plan your first date and build a meaningful relationship</p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Testimonials */}
        <section className="service-testimonials">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Real feedback from users who used our additional services</p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <div className="user-info">
                    <div className="user-avatar">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="avatar-placeholder">
                        <FiUser />
                      </div>
                    </div>
                    <div className="user-details">
                      <h4>{testimonial.name}</h4>
                      <span>{testimonial.service}</span>
                    </div>
                  </div>
                  <div className="rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FiStar key={i} className="star filled" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-text">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Get answers to common questions about our services</p>
          </div>

          <div className="faq-grid">
            <div className="faq-item">
              <h4>Can I upgrade or downgrade my plan anytime?</h4>
              <p>Yes, you can upgrade or downgrade your membership plan at any time. Changes take effect immediately for upgrades and at the next billing cycle for downgrades.</p>
            </div>
            <div className="faq-item">
              <h4>Are the additional services worth it?</h4>
              <p>Our additional services have a proven track record of increasing match success rates by 200-400%. They're designed by dating experts and photographers.</p>
            </div>
            <div className="faq-item">
              <h4>How does the matchmaking algorithm work?</h4>
              <p>Our AI algorithm analyzes over 100 compatibility factors including personality traits, interests, lifestyle, and relationship goals to find your best matches.</p>
            </div>
            <div className="faq-item">
              <h4>Is my personal information safe?</h4>
              <p>Absolutely. We use bank-level encryption and never share your personal information with third parties. You control who can see your profile and contact you.</p>
            </div>
            <div className="faq-item">
              <h4>What if I don't find matches?</h4>
              <p>We offer a satisfaction guarantee. If you don't find quality matches within 3 months of premium membership, we'll provide additional services at no cost.</p>
            </div>
            <div className="faq-item">
              <h4>Can I pause my membership?</h4>
              <p>Yes, premium members can pause their membership for up to 3 months per year. Your profile will be hidden during this time, and billing will be suspended.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="services-cta">
          <div className="cta-content">
            <FiHeart className="cta-icon" />
            <h2>Ready to Find Your Perfect Match?</h2>
            <p>
              Join millions of singles who have found love with FlirtingSingles. 
              Start your journey today with our free membership!
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary">
                Get Started Free
                <FiArrowRight />
              </Link>
              <Link to="/contact" className="cta-button secondary">
                Contact Us
                <FiMessageCircle />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;