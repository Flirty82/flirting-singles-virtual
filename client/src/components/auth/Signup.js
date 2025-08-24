// frontend/src/components/auth/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  FiEye, 
  FiEyeOff, 
  FiMail, 
  FiLock, 
  FiUser, 
  FiHeart, 
  FiArrowRight,
  FiCalendar,
  FiUserCheck
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const { register: registerUser, loading, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState('free');
  const [step, setStep] = useState(1);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    trigger
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      gender: '',
      membershipType: 'free',
      agreeToTerms: false,
      agreeToPrivacy: false,
      allowMarketing: false
    }
  });

  const watchedPassword = watch('password');
  const watchedFields = watch();

  // Clear any auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  const membershipPlans = {
    free: {
      name: 'Free',
      price: '$0',
      features: ['Basic matching', 'Limited messages', 'View profiles'],
      color: '#6c757d'
    },
    gold: {
      name: 'Gold',
      price: '$19.99/month',
      features: ['Unlimited messaging', 'See who liked you', 'Advanced filters'],
      color: '#ffd700'
    },
    platinum: {
      name: 'Platinum',
      price: '$29.99/month',
      features: ['All Gold features', 'Video chat', 'Profile boost'],
      color: '#e5e4e2'
    },
    diamond: {
      name: 'Diamond',
      price: '$49.99/month',
      features: ['All Platinum features', 'VIP badge', 'Exclusive events'],
      color: '#b9f2ff'
    }
  };

  const validateStep1 = () => {
    const fieldsToValidate = ['firstName', 'lastName', 'email', 'username'];
    return fieldsToValidate.every(field => !errors[field] && watchedFields[field]);
  };

  const validateStep2 = () => {
    const fieldsToValidate = ['password', 'confirmPassword', 'dateOfBirth', 'gender'];
    return fieldsToValidate.every(field => !errors[field] && watchedFields[field]);
  };

  const nextStep = async () => {
    let isValid = false;
    
    if (step === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'username']);
    } else if (step === 2) {
      isValid = await trigger(['password', 'confirmPassword', 'dateOfBirth', 'gender']);
    }
    
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const onSubmit = async (data) => {
    try {
      const registrationData = {
        ...data,
        membershipType: selectedMembership
      };

      delete registrationData.confirmPassword;

      const result = await registerUser(registrationData);

      if (result.success) {
        toast.success('Account created successfully!');
        
        // Navigate based on membership type and next step
        if (result.nextStep === 'payment') {
          navigate('/payment', { 
            state: { 
              membershipType: selectedMembership,
              returnUrl: '/profile/setup'
            }
          });
        } else {
          navigate('/profile/setup');
        }
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const renderStep1 = () => (
    <div className="registration-step">
      <div className="step-header">
        <h2>Create Your Account</h2>
        <p>Let's start with the basics</p>
      </div>

      {/* Name Fields */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <div className="form-input-container">
            <FiUser className="input-icon" />
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
                },
                maxLength: {
                  value: 50,
                  message: 'First name cannot exceed 50 characters'
                }
              })}
            />
          </div>
          {errors.firstName && (
            <span className="error-message">{errors.firstName.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <div className="form-input-container">
            <FiUser className="input-icon" />
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
                },
                maxLength: {
                  value: 50,
                  message: 'Last name cannot exceed 50 characters'
                }
              })}
            />
          </div>
          {errors.lastName && (
            <span className="error-message">{errors.lastName.message}</span>
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email Address
        </label>
        <div className="form-input-container">
          <FiMail className="input-icon" />
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
        </div>
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}
      </div>

      {/* Username Field */}
      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <div className="form-input-container">
          <FiUserCheck className="input-icon" />
          <input
            id="username"
            type="text"
            className={`form-input ${errors.username ? 'error' : ''}`}
            placeholder="Choose a unique username"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              },
              maxLength: {
                value: 30,
                message: 'Username cannot exceed 30 characters'
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: 'Username can only contain letters, numbers, and underscores'
              }
            })}
          />
        </div>
        {errors.username && (
          <span className="error-message">{errors.username.message}</span>
        )}
        <small className="form-help">
          This will be your unique identifier on FlirtingSingles
        </small>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="registration-step">
      <div className="step-header">
        <h2>Secure Your Account</h2>
        <p>Create a strong password and tell us about yourself</p>
      </div>

      {/* Password Fields */}
      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <div className="form-input-container">
          <FiLock className="input-icon" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Create a strong password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
              }
            })}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Confirm Password
        </label>
        <div className="form-input-container">
          <FiLock className="input-icon" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirm your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === watchedPassword || 'Passwords do not match'
            })}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className="error-message">{errors.confirmPassword.message}</span>
        )}
      </div>

      {/* Date of Birth */}
      <div className="form-group">
        <label htmlFor="dateOfBirth" className="form-label">
          Date of Birth
        </label>
        <div className="form-input-container">
          <FiCalendar className="input-icon" />
          <input
            id="dateOfBirth"
            type="date"
            className={`form-input ${errors.dateOfBirth ? 'error' : ''}`}
            max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
              validate: value => {
                const age = calculateAge(value);
                return age >= 18 || 'You must be 18 years or older to register';
              }
            })}
          />
        </div>
        {errors.dateOfBirth && (
          <span className="error-message">{errors.dateOfBirth.message}</span>
        )}
        {watchedFields.dateOfBirth && (
          <small className="form-help">
            Age: {calculateAge(watchedFields.dateOfBirth)} years old
          </small>
        )}
      </div>

      {/* Gender */}
      <div className="form-group">
        <label className="form-label">Gender</label>
        <div className="radio-group">
          {['male', 'female', 'non-binary', 'prefer-not-to-say'].map((gender) => (
            <label key={gender} className="radio-label">
              <input
                type="radio"
                value={gender}
                className="radio-input"
                {...register('gender', {
                  required: 'Please select your gender'
                })}
              />
              <span className="radio-custom"></span>
              {gender.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </label>
          ))}
        </div>
        {errors.gender && (
          <span className="error-message">{errors.gender.message}</span>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="registration-step">
      <div className="step-header">
        <h2>Choose Your Membership</h2>
        <p>Select the plan that's right for you</p>
      </div>

      <div className="membership-plans">
        {Object.entries(membershipPlans).map(([key, plan]) => (
          <div
            key={key}
            className={`membership-plan ${selectedMembership === key ? 'selected' : ''}`}
            onClick={() => setSelectedMembership(key)}
          >
            <div className="plan-header">
              <h3 style={{ color: plan.color }}>{plan.name}</h3>
              <div className="plan-price">{plan.price}</div>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            {key !== 'free' && (
              <div className="plan-badge">Most Popular</div>
            )}
          </div>
        ))}
      </div>

      {/* Terms and Privacy */}
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            {...register('agreeToTerms', {
              required: 'You must agree to the terms and conditions'
            })}
          />
          <span className="checkbox-custom"></span>
          I agree to the{' '}
          <Link to="/terms" target="_blank" className="link">
            Terms of Service
          </Link>
        </label>
        {errors.agreeToTerms && (
          <span className="error-message">{errors.agreeToTerms.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            {...register('agreeToPrivacy', {
              required: 'You must agree to the privacy policy'
            })}
          />
          <span className="checkbox-custom"></span>
          I agree to the{' '}
          <Link to="/privacy" target="_blank" className="link">
            Privacy Policy
          </Link>
        </label>
        {errors.agreeToPrivacy && (
          <span className="error-message">{errors.agreeToPrivacy.message}</span>
        )}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            className="checkbox-input"
            {...register('allowMarketing')}
          />
          <span className="checkbox-custom"></span>
          I'd like to receive marketing communications and special offers
        </label>
      </div>
    </div>
  );

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card registration-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <FiHeart className="logo-icon" />
              <h1>Join FlirtingSingles</h1>
            </div>
            <p className="auth-subtitle">
              Start your journey to finding meaningful connections
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="registration-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
            <div className="progress-steps">
              {[1, 2, 3].map((stepNumber) => (
                <div 
                  key={stepNumber}
                  className={`progress-step ${step >= stepNumber ? 'active' : ''}`}
                >
                  {stepNumber}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="step-navigation">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="step-button secondary"
                >
                  Previous
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="step-button primary"
                  disabled={
                    (step === 1 && !validateStep1()) ||
                    (step === 2 && !validateStep2())
                  }
                >
                  Continue
                  <FiArrowRight className="button-icon" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="auth-submit-button"
                >
                  {isSubmitting || loading ? (
                    <div className="button-loading">
                      <div className="spinner"></div>
                      Creating Account...
                    </div>
                  ) : (
                    <>
                      Create Account
                      <FiArrowRight className="button-icon" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;