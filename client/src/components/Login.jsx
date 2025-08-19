// frontend/src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Mail, Lock, Eye, EyeOff, Heart, Sparkles, Users, 
  MessageCircle, Gamepad2, Crown, AlertCircle, Loader 
} from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { signin, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Clear errors when component mounts
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      clearError();
      
      await signin(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              LoveConnect
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300">
              Where Gaming Meets Romance
            </p>
            <p className="text-gray-400 text-lg">
              Connect through shared experiences, compete in virtual worlds, and find your perfect match.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-pink-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <Heart className="w-6 h-6 text-pink-400" />
                <span className="font-semibold text-pink-300">Smart Matching</span>
              </div>
              <p className="text-sm text-gray-400">AI-powered compatibility based on gaming preferences and interests</p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <Gamepad2 className="w-6 h-6 text-purple-400" />
                <span className="font-semibold text-purple-300">Virtual Games</span>
              </div>
              <p className="text-sm text-gray-400">Karaoke, Bingo, VR experiences designed for connection</p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-blue-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <span className="font-semibold text-blue-300">Premium Chat</span>
              </div>
              <p className="text-sm text-gray-400">Exclusive chat rooms and direct messaging with advanced features</p>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 border border-yellow-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-6 h-6 text-yellow-400" />
                <span className="font-semibold text-yellow-300">VIP Benefits</span>
              </div>
              <p className="text-sm text-gray-400">Exclusive events, priority support, and premium features</p>
            </div>
          </div>

          {/* Membership Teasers */}
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-yellow-300">Gold Members: $14.99/mo</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-purple-300">Diamond Elite: $39.99/mo</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-black/40 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-gray-400">Sign in to continue your journey</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      formErrors.email 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                    } text-white placeholder-gray-400`}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                  />
                </div>
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white/10 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      formErrors.password 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-white/20 focus:border-purple-400 focus:ring-purple-500'
                    } text-white placeholder-gray-400`}
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="mt-1 text-sm text-red-400">{formErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-black/40 text-gray-400">New to LoveConnect?</span>
                </div>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                <Users className="w-5 h-5" />
                <span>Create your account</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-400">Join thousands of couples who found love through gaming</p>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <span>🎮 50K+ Gaming Sessions</span>
                  <span>💕 10K+ Successful Matches</span>
                  <span>⭐ 4.9/5 Rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Links */}
          <div className="mt-6 text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
              <span>•</span>
              <Link to="/support" className="hover:text-gray-300 transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;