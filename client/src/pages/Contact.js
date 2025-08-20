// frontend/src/pages/Contact.js
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiClock, 
  FiSend,
  FiMessageCircle,
  FiHelpCircle,
  FiShield,
  FiHeart,
  FiUsers,
  FiGlobe
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import './Contact.css';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const contactInfo = {
    address: {
      street: '123 Love Street, Suite 456',
      city: 'Romance City',
      state: 'TX',
      zipCode: '75001',
      country: 'United States'
    },
    phone: {
      main: '+1 (555) 123-LOVE',
      support: '+1 (555) 456-HELP',
      emergency: '+1 (555) 911-SAFE'
    },
    email: {
      general: 'hello@flirtingsingles.com',
      support: 'support@flirtingsingles.com',
      safety: 'safety@flirtingsingles.com',
      press: 'press@flirtingsingles.com'
    },
    hours: {
      weekdays: 'Monday - Friday: 9:00 AM - 8:00 PM CST',
      weekends: 'Saturday - Sunday: 10:00 AM - 6:00 PM CST',
      holidays: 'Holiday hours may vary'
    },
    social: {
      facebook: 'https://facebook.com/flirtingsingles',
      twitter: 'https://twitter.com/flirtingsingles',
      instagram: 'https://instagram.com/flirtingsingles',
      linkedin: 'https://linkedin.com/company/flirtingsingles'
    }
  };

  const departments = [
    {
      icon: <FiMessageCircle />,
      title: 'General Inquiries',
      email: contactInfo.email.general,
      description: 'Questions about our service, features, or general information'
    },
    {
      icon: <FiHelpCircle />,
      title: 'Technical Support',
      email: contactInfo.email.support,
      description: 'Having trouble with your account or experiencing technical issues?'
    },
    {
      icon: <FiShield />,
      title: 'Safety & Security',
      email: contactInfo.email.safety,
      description: 'Report safety concerns, suspicious profiles, or security issues'
    },
    {
      icon: <FiUsers />,
      title: 'Press & Media',
      email: contactInfo.email.press,
      description: 'Media inquiries, press releases, and partnership opportunities'
    }
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send this data to your backend
      console.log('Contact form submission:', data);
      
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="contact-hero-content">
            <FiHeart className="hero-icon" />
            <h1>Get In Touch</h1>
            <p>
              We're here to help you find love and make meaningful connections. 
              Reach out to us anytime - we'd love to hear from you!
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="contact-content">
          {/* Contact Form */}
          <section className="contact-form-section">
            <div className="section-header">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Your first name"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.firstName && (
                    <span className="error-message">{errors.firstName.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Your last name"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.lastName && (
                    <span className="error-message">{errors.lastName.message}</span>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="your@email.com"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: 'Please enter a valid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <span className="error-message">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="phone" className="form-label">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="(555) 123-4567"
                    {...register('phone', {
                      pattern: {
                        value: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                  />
                  {errors.phone && (
                    <span className="error-message">{errors.phone.message}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <select
                  id="subject"
                  className={`form-input ${errors.subject ? 'error' : ''}`}
                  {...register('subject', {
                    required: 'Please select a subject'
                  })}
                >
                  <option value="">Select a subject...</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="safety">Safety & Security</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="press">Press & Media</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && (
                  <span className="error-message">{errors.subject.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="6"
                  className={`form-input form-textarea ${errors.message ? 'error' : ''}`}
                  placeholder="Tell us how we can help you..."
                  {...register('message', {
                    required: 'Please enter your message',
                    minLength: {
                      value: 10,
                      message: 'Message must be at least 10 characters'
                    },
                    maxLength: {
                      value: 1000,
                      message: 'Message cannot exceed 1000 characters'
                    }
                  })}
                ></textarea>
                {errors.message && (
                  <span className="error-message">{errors.message.message}</span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="contact-submit-button"
              >
                {isSubmitting ? (
                  <div className="button-loading">
                    <div className="spinner"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <FiSend className="button-icon" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </section>

          {/* Contact Information */}
          <section className="contact-info-section">
            <div className="section-header">
              <h2>Other Ways to Reach Us</h2>
              <p>Choose the method that works best for you.</p>
            </div>

            {/* Departments */}
            <div className="departments-grid">
              {departments.map((dept, index) => (
                <div key={index} className="department-card">
                  <div className="department-icon">
                    {dept.icon}
                  </div>
                  <h3>{dept.title}</h3>
                  <p>{dept.description}</p>
                  <a href={`mailto:${dept.email}`} className="department-email">
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div className="contact-details">
              <div className="contact-detail-card">
                <div className="detail-icon">
                  <FiMapPin />
                </div>
                <div className="detail-content">
                  <h3>Our Address</h3>
                  <div className="address">
                    <p>{contactInfo.address.street}</p>
                    <p>
                      {contactInfo.address.city}, {contactInfo.address.state} {contactInfo.address.zipCode}
                    </p>
                    <p>{contactInfo.address.country}</p>
                  </div>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="detail-icon">
                  <FiPhone />
                </div>
                <div className="detail-content">
                  <h3>Phone Numbers</h3>
                  <div className="phone-numbers">
                    <div className="phone-item">
                      <span className="phone-label">General:</span>
                      <a href={`tel:${contactInfo.phone.main}`} className="phone-link">
                        {contactInfo.phone.main}
                      </a>
                    </div>
                    <div className="phone-item">
                      <span className="phone-label">Support:</span>
                      <a href={`tel:${contactInfo.phone.support}`} className="phone-link">
                        {contactInfo.phone.support}
                      </a>
                    </div>
                    <div className="phone-item">
                      <span className="phone-label">Emergency:</span>
                      <a href={`tel:${contactInfo.phone.emergency}`} className="phone-link">
                        {contactInfo.phone.emergency}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="detail-icon">
                  <FiClock />
                </div>
                <div className="detail-content">
                  <h3>Business Hours</h3>
                  <div className="hours">
                    <p>{contactInfo.hours.weekdays}</p>
                    <p>{contactInfo.hours.weekends}</p>
                    <p className="hours-note">{contactInfo.hours.holidays}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-grid">
                <div className="faq-item">
                  <h4>How do I reset my password?</h4>
                  <p>Click on "Forgot Password" on the login page and follow the instructions sent to your email.</p>
                </div>
                <div className="faq-item">
                  <h4>How do I upgrade my membership?</h4>
                  <p>Go to your account settings and click on "Upgrade Membership" to see available plans.</p>
                </div>
                <div className="faq-item">
                  <h4>How do I report a profile?</h4>
                  <p>Click the three dots menu on any profile and select "Report User" to file a safety report.</p>
                </div>
                <div className="faq-item">
                  <h4>Can I cancel my membership anytime?</h4>
                  <p>Yes, you can cancel your membership at any time from your account settings.</p>
                </div>
              </div>
              <div className="faq-footer">
                <p>
                  Can't find what you're looking for? 
                  <a href="/help" className="help-link"> Visit our Help Center</a>
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Emergency Contact */}
        <section className="emergency-contact">
          <div className="emergency-card">
            <FiShield className="emergency-icon" />
            <div className="emergency-content">
              <h3>Need Immediate Help?</h3>
              <p>
                If you're experiencing harassment, threats, or feel unsafe, 
                contact our safety team immediately.
              </p>
              <div className="emergency-actions">
                <a 
                  href={`tel:${contactInfo.phone.emergency}`} 
                  className="emergency-button phone"
                >
                  <FiPhone />
                  Call Now
                </a>
                <a 
                  href={`mailto:${contactInfo.email.safety}?subject=URGENT: Safety Concern`}
                  className="emergency-button email"
                >
                  <FiMail />
                  Email Safety Team
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Social Media */}
        <section className="social-media-section">
          <h3>Connect With Us</h3>
          <p>Stay updated with the latest news and features</p>
          <div className="social-links">
            <a 
              href={contactInfo.social.facebook} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link facebook"
              aria-label="Follow us on Facebook"
            >
              <FiGlobe />
              Facebook
            </a>
            <a 
              href={contactInfo.social.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link twitter"
              aria-label="Follow us on Twitter"
            >
              <FiGlobe />
              Twitter
            </a>
            <a 
              href={contactInfo.social.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link instagram"
              aria-label="Follow us on Instagram"
            >
              <FiGlobe />
              Instagram
            </a>
            <a 
              href={contactInfo.social.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link linkedin"
              aria-label="Follow us on LinkedIn"
            >
              <FiGlobe />
              LinkedIn
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;