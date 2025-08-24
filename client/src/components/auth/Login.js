// frontend/src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiMail, FiLock, FiHeart, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './Auth.css';

const Login = () => {
  const { login, loading, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const from = location.state?.from?.pathname || '/dashboard';
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      identifier: '',
      password: ''
    }
  });

  // Clear any auth errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Load remembered email if exists
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setValue('identifier', rememberedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      const result = await login({
        identifier: data.identifier.trim(),
        password: data.password
      });

      if (result.success) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', data.identifier.trim());
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect to intended page or dashboard
        navigate(result.redirectTo || from, { replace: true });
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    const demoCredentials = {
      identifier: 'demo@flirtingsingles.com',
      password: 'demo123'
    };

    try {
      const result = await login(demoCredentials);
      if (result.success) {
        toast.success('Welcome to the demo!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Demo login failed. Please try regular login.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-overlay"></div>
      </div>
      
      <div className="auth-content">
        <div className="auth-card">
          {/* Header */}
          <div className="auth-header">
            <div className="auth-logo">
              <FiHeart className="logo-icon" />
              <h1>Welcome Back</h1>
            </div>
            <p className="auth-subtitle">
              Sign in to continue your journey to finding love
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            {/* Email/Username Field */}
            <div className="form-group">
              <label htmlFor="identifier" className="form-label">
                Email or Username
              </label>
              <div className="form-input-container">
                <FiMail className="input-icon" />
                <input
                  id="identifier"
                  type="text"
                  className={`form-input ${errors.identifier ? 'error' : ''}`}
                  placeholder="Enter your email or username"
                  {...register('identifier', {
                    required: 'Email or username is required',
                    minLength: {
                      value: 3,
                      message: 'Must be at least 3 characters'
                    }
                  })}
                />
              </div>
              {errors.identifier && (
                <span className="error-message">{errors.identifier.message}</span>
              )}
            </div>

            {/* Password Field */}
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
                  placeholder="Enter your password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-row">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                Remember me
              </label>
              
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="auth-submit-button"
            >
              {isSubmitting || loading ? (
                <div className="button-loading">
                  <div className="spinner"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <FiArrowRight className="button-icon" />
                </>
              )}
            </button>

            {/* Demo Login */}
            <button
              type="button"
              onClick={handleDemoLogin}
              className="demo-button"
              disabled={isSubmitting || loading}
            >
              Try Demo Account
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>or</span>
          </div>

          {/* Social Login Buttons */}
          <div className="social-login">
            <button className="social-button google" disabled>
              <img src="/images/google-icon.svg" alt="Google" />
              Continue with Google
            </button>
            <button className="social-button facebook" disabled>
              <img src="/images/facebook-icon.svg" alt="Facebook" />
              Continue with Facebook
            </button>
          </div>

          {/* Footer */}
          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-switch-link">
                Join FlirtingSingles
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="auth-features">
          <h3>Why FlirtingSingles?</h3>
          <div className="features-list">
            <div className="feature-item">
              <FiHeart className="feature-icon" />
              <div>
                <h4>Find Your Match</h4>
                <p>Advanced matching algorithm to find your perfect partner</p>
              </div>
            </div>
            <div className="feature-item">
              <FiHeart className="feature-icon" />
              <div>
                <h4>Safe & Secure</h4>
                <p>Your privacy and security are our top priorities</p>
              </div>
            </div>
            <div className="feature-item">
              <FiHeart className="feature-icon" />
              <div>
                <h4>Real Connections</h4>
                <p>Connect with verified profiles and genuine people</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;